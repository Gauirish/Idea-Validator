import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("WARNING: Supabase URL or Anon Key missing from environment variables.");
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
const apiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;

app.post('/api/ideas', async (req, res) => {
    try {
        const { email, title, description } = req.body;
        
        if (!email || !title || !description) {
            return res.status(400).json({ error: 'Missing required fields: email, title, description' });
        }

        const prompt = `
            Analyze the following startup idea and provide a structured validation report in JSON format.
            
            Startup Title: ${title}
            Description: ${description}
            
            The JSON should have these exact keys:
            - problemSummary: string
            - customerPersona: string
            - marketOverview: string
            - competitorList: array of strings
            - techStack: array of strings
            - riskLevel: "Low" | "Medium" | "High"
            - profitabilityScore: number (0-100)
        `;

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "You are an expert startup consultant. Always return JSON." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.json().catch(() => ({}));
            throw new Error(`Groq API error: ${errorData.error?.message || groqResponse.statusText}`);
        }

        const groqResult = await groqResponse.json();
        const report = JSON.parse(groqResult.choices[0].message.content);

        const { data, error: insertError } = await supabase
            .from('Idea')
            .insert([{ email, title, description, result: report }])
            .select();

        if (insertError) {
            console.error("Supabase insert error:", insertError);
            throw new Error(`Database error: ${insertError.message}`);
        }

        res.status(201).json({ report, record: data[0] });

    } catch (error) {
        console.error('POST /api/ideas error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.get('/api/ideas', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: 'Email parameter is required' });

        const { data, error } = await supabase
            .from('Idea')
            .select('*')
            .eq('email', email);

        if (error) throw error;

        res.json([...data].reverse());
    } catch (error) {
        console.error('GET /api/ideas error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/ideas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('Idea')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return res.status(404).json({ error: 'Idea not found' });
            throw error;
        }
        res.json(data);
    } catch (error) {
        console.error(`GET /api/ideas/${req.params.id} error:`, error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/ideas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('Idea')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Deleted successfully', data });
    } catch (error) {
        console.error(`DELETE /api/ideas/${req.params.id} error:`, error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Server running securely on port ${PORT}`);
    console.log(`Ready to accept API requests from frontend.`);
});
