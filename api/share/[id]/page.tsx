'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SharedNote {
  id: string;
  title: string;
  description: string;
}

export default function SharedNotePage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState<SharedNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/share/${params.id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch note');
          }
          return response.json();
        })
        .then(data => {
          setNote(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!note) return <div>Note not found</div>;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{note.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}