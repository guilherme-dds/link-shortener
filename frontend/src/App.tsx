import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timerId = setTimeout(() => {
      setCopied(false);
    }, 2000); // Reseta o texto 'Copiado!' após 2 segundos

    return () => clearTimeout(timerId); // Limpa o timer se o componente for desmontado
  }, [copied]);

  const handleShortenClick = async () => {
    // Validação manual, já que o 'required' do form não é mais usado
    if (!url) {
      setError('Por favor, cole uma URL para encurtar.');
      return;
    }

    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);
    try {
      // Substitua pela URL da sua API backend
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao encurtar o link.');
      }

      const data = await response.json();
      // Assumindo que a API retorna { shortUrl: '...' }
      setShortUrl(`${window.location.origin}/${data.shortId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
  };

  return (
    <div className="container">
      <h1>Encurtador de Link</h1>
      <div className="form-container">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole sua URL longa aqui"
        />
        <button type="button" onClick={handleShortenClick} disabled={loading}>
          {loading ? 'Encurtando...' : 'Encurtar'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {shortUrl && (
        <div className="result-container">
          <p>Seu link encurtado:</p>
          <div className="short-url">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
            <button onClick={handleCopy}>{copied ? 'Copiado!' : 'Copiar'}</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
