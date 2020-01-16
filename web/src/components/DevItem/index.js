import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export default function Main({ dev, onDelete }) {
  return (
    <li className="dev-item">
      <header>
        <img src={dev?.avatar_url} alt={dev?.name} />
        <div className="user-info">
          <strong>{dev?.name}</strong>
          <span>{dev?.techs.join(', ')}</span>
        </div>
      </header>
      <p>{dev?.bio}</p>
      <div className="user-actions">
        <a href={`https://github.com/${dev?.github_username}`}>
          Acessar perfil no github
        </a>

        <a href="#delete" className="delete" onClick={() => onDelete(dev._id)}>
          Deletar
        </a>
      </div>
    </li>
  );
}

Main.propTypes = {
  dev: PropTypes.shape().isRequired,
  onDelete: PropTypes.func.isRequired,
};
