-- ============================================================
-- SEED: Learning modules
-- ============================================================
insert into public.learning_modules (title, description, content_type, content_url, content_body, duration_minutes, order_index, audience, is_required) values

-- ALL participants
('Welcome to RTR', 'An introduction to Reconciliation Through Relationships and what this journey means.', 'video',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 null, 5, 1, 'all', true),

-- Non-Indigenous track
('Understanding Truth and Reconciliation', 'Learn about the Truth and Reconciliation Commission of Canada and the 94 Calls to Action that guide this work.', 'text',
 null,
 'The Truth and Reconciliation Commission of Canada (TRC) concluded its six-year mandate in 2015, having gathered testimony from more than 6,000 residential school survivors.

The TRC's final report documents the history and ongoing impacts of the residential school system. Its 94 Calls to Action call on governments, institutions, faith communities, and Canadians in all walks of life to do their part in advancing reconciliation.

RTR was founded in direct response to these calls — specifically to create meaningful opportunities for Indigenous and non-Indigenous Canadians to know one another as people, not just as statistics or news stories.

As a non-Indigenous participant, your journey of learning is one of the most important steps you can take. We ask you to approach this work with humility, openness, and a willingness to be changed by what you hear.',
 15, 2, 'non_indigenous', true),

('The Residential School System', 'Understanding the history and ongoing impacts of the residential school system on Indigenous communities.', 'text',
 null,
 'From the 1870s to 1996, the Canadian government operated more than 130 residential schools across the country, with the explicit goal of removing Indigenous children from their families and assimilating them into Euro-Canadian culture.

More than 150,000 First Nations, Métis, and Inuit children were taken from their families and communities. Many were forbidden to speak their languages or practice their cultures. Thousands never returned home.

The impacts of the residential school system are intergenerational. Survivors, their children, and their grandchildren carry the effects of trauma, family separation, loss of language, and loss of cultural identity.

Reconciliation requires more than awareness — it requires relationship. When you connect with an Indigenous participant through RTR, you are not meeting a representative of history. You are meeting a person with their own story, gifts, and hopes for the future.',
 20, 3, 'non_indigenous', true),

('How Matching and Connection Works', 'A guide to the RTR matching process, what to expect when you connect, and how to be a good conversation partner.', 'text',
 null,
 'RTR uses a facilitator-guided matching process. Here''s what to expect:

1. After you complete your learning journey, RTR facilitators will review your profile and suggest a match based on shared location, interests, language, and other factors.

2. Once a match is approved, you will both receive a notification. Both parties must click "Connect" to activate the chat — this ensures that connection is mutual and chosen.

3. Your first conversation doesn''t need to be about reconciliation. Talk about your lives, your communities, what you care about. The relationship comes first.

4. When you''re both ready, you can schedule your first video call through Zoom. You can schedule as many calls as you like based on your availability.

5. Over time, you may be invited to join a local reconciliation cohort — a small group in your area that comes together for events and action.

Please remember: you are not here to explain or defend history, or to represent your community. You are here as yourself. That is enough.',
 10, 4, 'non_indigenous', true),

-- Indigenous track
('About the RTR Platform', 'How RTR works, what your profile is used for, and how to get the most from your participation.', 'text',
 null,
 'Welcome to Reconciliation Through Relationships. This platform was created to support the work of relationship-building between Indigenous and non-Indigenous Canadians.

Your participation matters. When you connect with a non-Indigenous person through RTR, you are taking part in something the TRC''s Calls to Action explicitly asked for: meaningful, human contact across cultural divides.

You are never obligated to educate, explain, or represent your community. Your story is your own, and you share only what you choose to share.

RTR facilitators — people trained in this work — will review your profile and suggest a connection based on factors you set yourself. You always have the choice to connect or not.

Your location is only ever shown at the city level, and your personal information is shared only with your matched connection and RTR facilitators.',
 8, 2, 'indigenous', true),

('How Matching and Connection Works', 'A guide to the RTR matching process and what to expect when you connect.', 'text',
 null,
 'Here''s what to expect from the RTR matching process:

1. After you complete this orientation, RTR facilitators will review your profile and suggest a potential connection based on your preferences — location, interests, and how you like to connect.

2. Once a match is approved, you will receive a notification. Both you and your match must click "Connect" to activate the chat. This is always your choice.

3. Your first conversation can be about anything. Your life, your community, your interests. The relationship comes first.

4. When you''re ready, you can schedule a video call through Zoom directly from the platform.

5. If there are enough participants in your area who have completed their learning journey, a local reconciliation cohort may form — a small group that comes together for community events.

We honour your time and your story.',
 8, 3, 'indigenous', true);


-- ============================================================
-- SEED: Synthetic participants
-- Note: In a real deployment, these would be inserted via Supabase Admin SDK
-- with corresponding auth.users entries. This migration inserts profile data only.
-- Run the seed-users script separately to create auth users.
-- ============================================================

-- Insert placeholder to remind deployer
comment on table public.profiles is
  'Use supabase/seeds/participants.ts script to create synthetic auth users and profiles for demo.';
