import { api } from '../lib/axios';

// ...existing code...

export async function getEspecies() {
  const response = await api.get('/especies');
  return response.data;
}

export async function getRacasByEspecie(especieId: number) {
  const response = await api.get(`/racas/${especieId}`);
  return response.data;
}
