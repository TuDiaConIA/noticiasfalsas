'use client';

import React, { useState } from "react";
import Image from 'next/image';
import {
  Container, Typography, Box, TextField, Button, CircularProgress, Card, CardContent, Link, List, ListItem, LinearProgress
} from '@mui/material';

type Source = {
  title: string;
  url: string;
};

type AnalysisResponse = {
  sources: Source[];
  openai_analysis: string;
};

function extractPercentage(text: string): number {
  const match = text.match(/(\d{1,3})\s?%/);
  if (match) {
    let pct = parseInt(match[1], 10);
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    return pct;
  }
  return 50;
}

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('https://noticiasfalsas-backend.onrender.com/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });


      if (!res.ok) {
        throw new Error('Error en el servidor');
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
        setError((err as Error)?.message || 'Error desconocido');
      }
    setLoading(false);
  };

  const percent = result ? extractPercentage(result.openai_analysis) : 0;

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card variant="outlined" sx={{ p: 3, mb: 3, boxShadow: 2 }}>
        {/* NAVBAR LOGO + TITULO */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Image src="/favicon.ico" alt="Logo" width={38} height={38} style={{ borderRadius: '100%' }} />
          <Typography variant="h4" component="h1" fontWeight={500} align="center" mt={1}>
            Verificador de Noticias Falsas
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Introduce una noticia o enlace a verificar..."
            variant="outlined"
            fullWidth
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
            required
          />
          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ minWidth: 180 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={22} sx={{ mr: 1 }} />
                  Analizando...
                </>
              ) : (
                'Verificar'
              )}
            </Button>
          </Box>
        </form>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Card>

      {/* RESULTADO */}
      {result && !loading && (
        <Card sx={{ boxShadow: 3, mt: 4 }}>
          <CardContent>
            <Box textAlign="center" sx={{ mb: 2 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Porcentaje de veracidad estimado
              </Typography>
              <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
                {percent}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: "#e0e0e0",
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 7,
                  }
                }}
              />
            </Box>
            <Typography
              sx={{
                whiteSpace: 'pre-wrap',
                background: '#f7f7f7',
                p: 2,
                borderRadius: 2,
                mb: 2,
                fontSize: 16,
                fontFamily: 'inherit'
              }}
            >
              {result.openai_analysis}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Fuentes encontradas
            </Typography>
            <List>
              {result.sources.length === 0 && <ListItem>No se encontraron fuentes.</ListItem>}
              {result.sources.map((src, i) => (
                <ListItem key={i} sx={{ display: 'list-item' }}>
                  <Link href={src.url} target="_blank" rel="noopener noreferrer">
                    {src.title}
                  </Link>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
