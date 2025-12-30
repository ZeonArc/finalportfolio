-- Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Games', 'Web', 'Design')),
  image_url TEXT,
  project_url TEXT,
  tech_stack TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Profile Table
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  experience JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Messages Table (Contact Form)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Read Access
CREATE POLICY "Allow public read access on projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on profile"
  ON profile FOR SELECT
  USING (true);

-- Create Policy for Public Insert on Messages
CREATE POLICY "Allow public insert on messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Insert Sample Data (Profile)
INSERT INTO profile (full_name, title, bio, experience, skills)
VALUES (
  'Alex Developer',
  'Creative Technologist',
  'Passionate about creating immersive digital experiences. Specializing in game development, interactive web design, and 3D graphics.',
  '[
    {"title": "Senior Game Dev", "company": "Indie Studio", "period": "2023-Present", "description": "Lead developer for upcoming RPG title. Implemented core gameplay systems and AI behavior."},
    {"title": "Frontend Engineer", "company": "Tech Corp", "period": "2021-2023", "description": "Built responsive web applications using React and GSAP. Improved site performance by 40%."}
  ]'::jsonb,
  '{
    "Languages": ["JavaScript", "C#", "Python", "GLSL"],
    "Frontend": ["React", "Three.js", "GSAP", "Tailwind"],
    "Tools": ["Unity", "Blender", "Figma", "Git"]
  }'::jsonb
);

-- Insert Sample Data (Projects)
INSERT INTO projects (title, description, category, is_featured, tech_stack)
VALUES 
('Neon Racer', 'High-speed cyberpunk racing game built with Unity.', 'Games', true, '{"Unity", "C#", "HLSL"}'),
('Portfolio V2', 'Award-winning immersive web experience.', 'Web', true, '{"React", "GSAP", "Three.js"}'),
('Design System', 'Comprehensive UI kit for modern apps.', 'Design', true, '{"Figma", "CSS", "Storybook"}');
