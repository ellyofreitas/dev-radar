import React, { useState, useEffect } from 'react';

import api from './services/api';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

import './global.css';
import './App.css';
import './Main.css';
import './Sidebar.css';

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data } = await api.get('/devs');
      setDevs(data);
    }

    loadData();
  }, []);

  async function handleAddDev(payload) {
    const { data } = await api.post('/devs', payload);

    setDevs(oldDevs => [...oldDevs, data]);
  }

  async function handleDeleteDev(id) {
    await api.delete(`/devs/${id}`);

    setDevs(oldDevs => oldDevs.filter(d => d._id !== id));
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} onDelete={handleDeleteDev} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
