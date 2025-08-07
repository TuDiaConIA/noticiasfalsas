'use client';

import React, { useState } from "react";
import Image from 'next/image';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container, Typography, Box, TextField, Button, CircularProgress, Card, CardContent, Link, List, ListItem, LinearProgress, Paper
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
    <Container maxWidth="sm" sx={{ mt: 6, mb: 8 }}>
      <CssBaseline />
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, mb: 4, borderRadius: 5, background: "white" }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Image
            src="/favicon.ico"
            alt="Escudo de verificación de noticias"
            width={48}
            height={48}
            priority
            style={{ borderRadius: '100%', marginBottom: 8, boxShadow: "0 2px 12px #1976d2bb" }}
          />
          <Typography variant="h1" component="h1" sx={{
            fontSize: { xs: 28, sm: 38 },
            fontWeight: 700,
            letterSpacing: 1,
            textAlign: "center",
            color: "#1a237e",
            mb: 1
          }}>
            Verificador de Noticias Falsas con IA
          </Typography>
          <Typography variant="subtitle1" sx={{
            color: "#1976d2",
            textAlign: "center",
            fontSize: 18,
            mt: 0,
            mb: 2
          }}>
            Detector de bulos, fake news y enlaces sospechosos.<br />
            Analiza titulares, textos o URLs al instante con inteligencia artificial y fuentes científicas.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} aria-label="Formulario verificador de noticias falsas">
          <TextField
            label="Introduce una noticia, titular o enlace a verificar..."
            variant="outlined"
            fullWidth
            value={text}
            onChange={e => { setText(e.target.value); setError(''); }}
            disabled={loading}
            sx={{ mb: 2, background: "#f0f6fc", borderRadius: 2 }}
            required
            autoFocus
            inputProps={{
              'aria-label': "Campo de texto para noticia o enlace"
            }}
          />
          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{
                minWidth: 180,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "0 3px 16px #1976d244",
                letterSpacing: 1,
                fontSize: 18
              }}
              aria-label="Verificar noticia o enlace"
            >
              {loading ? (
                <>
                  <CircularProgress size={22} sx={{ mr: 1 }} />
                  Analizando...
                </>
              ) : (
                'VERIFICAR'
              )}
            </Button>
          </Box>
        </form>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>

      {/* RESULTADO */}
      {result && !loading && (
        <Card sx={{
          boxShadow: 5,
          mt: 3,
          mb: 4,
          borderRadius: 4,
          background: "#f8fafc",
        }}>
          <CardContent>
            <Box textAlign="center" sx={{ mb: 2 }}>
              <Typography variant="h2" sx={{
                fontSize: { xs: 22, sm: 28 },
                fontWeight: 700,
                color: "#1565c0",
                mb: 1
              }}>
                Porcentaje de veracidad estimado
              </Typography>
              <Typography variant="h1" fontWeight={700} sx={{
                fontSize: { xs: 42, sm: 64 },
                mb: 1,
                color: percent > 50 ? "#2e7d32" : "#d32f2f"
              }}>
                {percent}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: "#e3eafc",
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 9,
                  }
                }}
                aria-label="Barra de porcentaje de veracidad"
              />
              <Typography variant="body1" sx={{ color: "#555", mt: 1 }}>
                Porcentaje de veracidad: <strong>{percent}%</strong>
              </Typography>
            </Box>
            <Typography
              component="section"
              sx={{
                whiteSpace: 'pre-wrap',
                background: '#f7f7f7',
                p: 2.2,
                borderRadius: 2,
                mb: 3,
                fontSize: 17,
                fontFamily: 'inherit'
              }}
            >
              {result.openai_analysis}
            </Typography>
            <Typography variant="h3" component="h2" sx={{
              fontSize: 22,
              fontWeight: 600,
              color: "#1976d2",
              mb: 1,
              mt: 1
            }}>
              Fuentes encontradas
            </Typography>
            <List sx={{ mb: 1 }}>
              {result.sources.length === 0 && <ListItem>No se encontraron fuentes.</ListItem>}
              {result.sources.map((src: Source, i: number) => (
                <ListItem key={i} sx={{ display: 'list-item', mb: 1 }}>
                  <Link href={src.url} target="_blank" rel="noopener noreferrer" underline="hover">
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
