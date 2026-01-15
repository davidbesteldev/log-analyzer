> ⚠️ **Nota:** Este projeto foi desenvolvido exclusivamente para fins de avaliação técnica em um processo seletivo.

# 📊 Log Analyzer

Um analisador de logs para processamento de dados e geração de estatísticas.

## 🚀 Run project

```bash
# Crie a .env conforme a .env.example do projeto
cp .env.example .env

# Instale as dependências
npm install

# Executa as migrations
npm run prisma:migrate:dev

# Gera os clientes do Prisma
npm run prisma:generate

# Inicia em modo watch
npm run start:dev
```

---

## 📖 Facilitators

- Acesse a documentação das rotas via **Swagger**: [http://localhost:3000/docs](http://localhost:3000/docs)
- Visualize rapidamente os dados com:

  ```bash
  npm run prisma:studio
  ```

- Zera o banco de dados, recria as tabelas e roda o seed automaticamente ❗somente para desenvolvimento❗:
  ```bash
  npx prisma migrate reset
  ```
- Exemplo de log para importar com o tipo "game": [log](assets/game-log-example.log)

---

## 🔧 Improvements

- Transformar a rota de importação em **assíncrona com fila de processamento**, evitando bloqueio e garantindo controle de carga em importações simultâneas.
- A aplicação já está configurada para usar **Jest** (incluindo workflow no GitHub). No momento está manual, mas a boa prática é configurá-lo para rodar automaticamente em **CI/CD**, por hora esta manual pois é preciso **melhorar a cobertura de testes da aplicação**.
- Melhorar os detalhes da documentação no **Swagger**, permitindo exportação direta para facilitar integrações.
- Incluir autenticação nas rotas.

---

## 💡 Tips

- Para quem usa **VSCode**, recomendo rodar um **Reload Window** após executar "prisma:generate"

---

## 🎯 Challenge Issues

- Ranking Global de Jogadores
- Friendly Fire

---
