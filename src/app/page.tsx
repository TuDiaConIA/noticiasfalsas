'use client';

import React, { useState } from "react";
import Image from 'next/image';
import CssBaseline from '@mui/material/CssBaseline';
import { GridLegacy } from '@mui/material';
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
    <Box minHeight="100vh" display="flex" flexDirection="column" bgcolor="#f3f6fa">
      <Container maxWidth="md" sx={{ mt: 7, mb: 6, flexGrow: 1 }}>
        <CssBaseline />
        <GridLegacy container spacing={4} justifyContent="center" alignItems="flex-start">
          {/* CENTRO: APP PRINCIPAL */}
          <GridLegacy item xs={12} md={8}>
            <Paper elevation={8} sx={{
              p: { xs: 2, sm: 5 },
              borderRadius: 5,
              mb: 4,
              background: "white",
              boxShadow: "0 6px 32px #1976d222",
              position: "relative"
            }}>
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                <Image
                  src="/favicon.ico"
                  alt="Escudo de verificación de noticias"
                  width={56}
                  height={56}
                  priority
                  style={{ borderRadius: '100%', marginBottom: 10, boxShadow: "0 2px 12px #1976d2bb" }}
                />
                <Typography variant="h1" component="h1" sx={{
                  fontSize: { xs: 28, sm: 38, md: 44 },
                  fontWeight: 800,
                  letterSpacing: 1,
                  textAlign: "center",
                  color: "#1a237e",
                  mb: 1.5
                }}>
                  Verificador de Noticias Falsas con IA
                </Typography>
                <Typography variant="subtitle1" sx={{
                  color: "#1976d2",
                  textAlign: "center",
                  fontSize: { xs: 16, sm: 20 },
                  mt: 0,
                  mb: 2,
                  fontWeight: 500
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
                      fontWeight: 700,
                      boxShadow: "0 3px 16px #1976d244",
                      letterSpacing: 1,
                      fontSize: 19
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
            </Paper>

            {/* Bloque SEO ABAJO */}
            <Paper elevation={0} sx={{
              p: 3, mt: 3, background: "#eef4fa", color: "#154078",
              fontSize: 17, lineHeight: 1.7, borderRadius: 3
            }}>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1 }}>
                ¿Por qué es importante verificar noticias falsas?
              </Typography>
              <Typography component="div" sx={{ fontSize: 17, mb: 1 }}>
                Las <b>noticias falsas</b> y los <b>bulos</b> pueden manipular la opinión pública, crear confusión y dañar la confianza en los medios.
                La <b>verificación de noticias</b> ayuda a combatir la <b>desinformación</b> y protege la sociedad de fraudes, timos y rumores.
                <ul style={{ marginTop: 6 }}>
                  <li>Evita la <b>propagación de bulos</b> en redes sociales</li>
                  <li>Identifica <b>fuentes fiables</b> y periodismo de calidad</li>
                  <li>Reduce el impacto de <b>fake news</b> en elecciones y salud pública</li>
                </ul>
                Usa nuestro <b>verificador de noticias falsas</b> con <b>inteligencia artificial</b> para analizar titulares, textos o enlaces y descubrir la <b>veracidad de la información</b> en tiempo real.
              </Typography>
            </Paper>
          </GridLegacy>

          {/* DERECHA: Consejos SEO */}
          <GridLegacy item xs={12} md={4}>
            <Paper elevation={0} sx={{
              p: 3, background: "transparent", color: "#154078",
              fontSize: 17, lineHeight: 1.7, borderRadius: 2,
              position: { md: "sticky" }, top: { md: 32 }
            }}>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1 }}>
                Consejos para identificar noticias falsas
              </Typography>
              <ul>
                <li>Verifica siempre la <b>fuente original</b> y el <b>autor</b></li>
                <li>Duda de los titulares sensacionalistas o alarmistas</li>
                <li>Contrasta la noticia en <b>medios fiables y oficiales</b></li>
                <li>Evita compartir información dudosa sin comprobarla</li>
                <li>Consulta plataformas de <b>fact-checking</b> y organismos oficiales</li>
                <li>La <b>IA</b> te ayuda, pero usa siempre el <b>pensamiento crítico</b></li>
              </ul>
              <p>
                Contribuye a una <b>internet más segura y libre de fake news</b>. Nuestro <b>detector de bulos</b> está optimizado para el <b>análisis de noticias en español</b>.
              </p>
            </Paper>
          </GridLegacy>
        </GridLegacy>
      </Container>
    </Box>
  );
}
