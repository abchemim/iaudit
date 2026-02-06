-- Create mailbox_messages table for e-CAC/SEFAZ messages
CREATE TABLE public.mailbox_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'e-CAC RFB',
  message_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  priority TEXT NOT NULL DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mailbox_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view messages of their clients"
  ON public.mailbox_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM clients WHERE clients.id = mailbox_messages.client_id AND clients.user_id = auth.uid()
  ));

CREATE POLICY "Users can create messages for their clients"
  ON public.mailbox_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients WHERE clients.id = mailbox_messages.client_id AND clients.user_id = auth.uid()
  ));

CREATE POLICY "Users can update messages of their clients"
  ON public.mailbox_messages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM clients WHERE clients.id = mailbox_messages.client_id AND clients.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete messages of their clients"
  ON public.mailbox_messages FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM clients WHERE clients.id = mailbox_messages.client_id AND clients.user_id = auth.uid()
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_mailbox_messages_updated_at
  BEFORE UPDATE ON public.mailbox_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'accountant' CHECK (role IN ('admin', 'accountant', 'assistant')),
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies - users can view all profiles in the same organization (for now, just their own)
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create profile (if not exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();