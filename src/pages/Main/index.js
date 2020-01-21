import React, { Component } from 'react';
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import Container from '../../components/container';
import { Form, SubmitButton, List, Message } from './styles';
import api from '../../services/api';

export default class Main extends Component {

  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    msg: ''
  }

  //Carregar dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  //Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }


  handleInputChanged = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();


    try {
      this.setState({ loading: true });

      const { newRepo, repositories } = this.state;

      if (newRepo === '') {

        this.setState({
          loading: false,
          newRepo: '',
          msg: 'Você precisa indicar um repositório',
        });

        throw 'Você precisa indicar um repositório';
      }


      const hasRepo = repositories.find(r => r.name === newRepo);

      if (hasRepo) {
        this.setState({
          loading: false,
          newRepo: '',
          msg: 'Repositorio duplicado',
        });
        throw 'Repositorio duplicado';
      }

      const response = await api.get(`/repos/${newRepo}`);


      const data = {
        name: response.data.full_name,
      };
      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
        msg: '',
      });
    } catch (error) {
      this.setState({ error: true });
    }
    finally {
      this.setState({ loading: false });
    }
  };
  render() {

    const { newRepo, repositories, loading, msg } = this.state;

    return (
      <Container>
        <h1>
          <FaGithub />
          Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChanged}
          />

          <SubmitButton loading={loading}>

            {loading ?
              (<FaSpinner color="#FFF" size={14} />)
              : (<FaPlus color="#FFF" size={14} />)
            }

          </SubmitButton>
        </Form>
        <Message>{msg}</Message>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>

      </Container>
    );
  }
}
