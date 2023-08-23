//onde vou criar as rotas

const express = require('express');
const { criarConta, listarContas, atualizarDadosContas, excluirConta, depositar, sacar, transferir, verificarSaldo, verificarExtrato } = require('./controladores/controladores');
const rotas = express();
const { verificarBodyDeposito, verificarBodySaque, verificarBodySaldoeExtrato, verificarBodyTransferencia } = require('./intermediarios')

rotas.post('/contas', criarConta);
rotas.get('/contas', listarContas);
rotas.put('/contas/:numeroConta', atualizarDadosContas);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', verificarBodyDeposito, depositar);
rotas.post('/transacoes/sacar', verificarBodySaque, sacar);
rotas.post('/transacoes/transferir', verificarBodyTransferencia, transferir);
rotas.get('/contas/saldo', verificarBodySaldoeExtrato, verificarSaldo);
rotas.get('/contas/extrato', verificarBodySaldoeExtrato, verificarExtrato)

module.exports = rotas;