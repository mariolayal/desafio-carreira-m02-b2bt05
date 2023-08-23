//onde vou criar as funcoes
const { banco, contas, saques, depositos, transferencias } = require('../bancodedados')


let numero_conta = 1
const criarConta = (req, res) => {
    const novaConta = req.body;

    const cpfExistente = contas.some((conta) => {
        return numero_conta.cpf === conta.cpf;
    });

    const emailExistente = contas.some((conta) => {
        return numero_conta.email === conta.email;
    });

    if (cpfExistente || emailExistente) {
        return res.status(401).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    } else {
        const novoUsuario = { numero_conta: numero_conta.toString(), ...novaConta, saldo: 0 };
        numero_conta++
        contas.push(novoUsuario);
        return res.status(201).json();
    }
}

const listarContas = (req, res) => {
    const { senha_banco } = req.query;

    if (senha_banco !== 'Cubos123Bank') {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
    }

    return res.status(200).json(contas);
}

const atualizarDadosContas = (req, res) => {
    const contaAtualizada = req.body;


    if (!contaAtualizada.nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório!' })
    };

    if (!contaAtualizada.cpf) {
        return res.status(400).json({ mensagem: 'O campo CPF é obrigatório!' })
    };

    if (!contaAtualizada.data_nascimento) {
        return res.status(400).json({ mensagem: 'O campo data_nascimento é obrigatório!' })
    };

    if (!contaAtualizada.telefone) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório!' })
    };

    if (!contaAtualizada.email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório!' })
    };

    if (!contaAtualizada.senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório!' })
    };

    const usuarioExistente = contas.find((usuario) => {
        return usuario.numero_conta === req.params.numero_conta;
    });

    if (!usuarioExistente) {
        return res.status(404).json({ mensagem: 'O número da conta informado não corresponde a nenhum usuário' })
    };

    const cpfExistente = contas.some((conta) => {
        return contaAtualizada.cpf === conta.cpf;
    });

    const emailExistente = contas.some((conta) => {
        return contaAtualizada.email === conta.email;
    });

    if (cpfExistente || emailExistente) {
        return res.status(401).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    usuarioExistente.nome = contaAtualizada.nome;
    usuarioExistente.cpf = contaAtualizada.cpf;
    usuarioExistente.data_nascimento = contaAtualizada.data_nascimento;
    usuarioExistente.telefone = contaAtualizada.telefone;
    usuarioExistente.email = contaAtualizada.email;
    usuarioExistente.senha = contaAtualizada.senha;

    return res.status(201).json();

}

const excluirConta = (req, res) => {

    const usuarioExistente = contas.find((usuario) => {
        return usuario.numero_conta === req.params.numero_conta;
    });

    if (!usuarioExistente) {
        return res.status(404).json({ mensagem: 'O número da conta informado não corresponde a nenhum usuário' })
    };


    if (usuarioExistente.saldo !== 0) {
        return res.status(401).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
    }

    const indiceContaASerExcluida = contas.findIndex((conta) => {
        return conta.numero_conta === req.params.numero_conta
    });

    contas.splice(indiceContaASerExcluida, 1);

    return res.status(200).json();
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body
    const contaExistente = contas.find((conta) => {
        return conta.numero_conta === numero_conta;
    });

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'O número da conta informado não corresponde a nenhum usuário' })
    };

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'Não é possível fazer um depósito com valor negativo ou igual a zero!' })
    }

    contaExistente.saldo += valor

    const novoDeposito = { data: new Date(), numero_conta, valor };

    depositos.push(novoDeposito);

    return res.status(201).send();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body
    const contaExistente = contas.find((conta) => {
        return conta.numero_conta === numero_conta;
    });

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'O número da conta informado não corresponde a nenhum usuário' })
    };

    if (contaExistente.senha !== senha) {
        return res.status(404).json({ mensagem: 'Senha incorreta!' })
    };

    if (contaExistente.saldo === 0 || contaExistente.saldo < valor) {
        return res.status(401).json({ mensagem: "Não há saldo disponível para saque!" })
    }
    contaExistente.saldo -= valor


    const novoSaque = { data: new Date(), numero_conta, valor };

    saques.push(novoSaque);

    return res.status(201).send();

}
const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, senha, valor } = req.body;
    const contaOrigem = contas.find((conta) => {
        return conta.numero_conta === numero_conta_origem;
    });

    if (!contaOrigem) {
        return res.status(401).json({ mensagem: "A conta de origem informada não existe!" })

    }

    const contaDestino = contas.find((conta) => {
        return conta.numero_conta === numero_conta_destino;
    });

    if (!contaDestino) {
        return res.status(401).json({ mensagem: "A conta de destino informada não existe!" })

    };

    if (contaOrigem.senha !== senha) {
        return res.status(404).json({ mensagem: 'Senha incorreta!' })
    };

    if (contaOrigem.saldo === 0 || contaOrigem.saldo < valor) {
        return res.status(401).json({ mensagem: "Não há saldo disponível para saque!" })
    }

    contaOrigem.saldo -= valor
    contaDestino.saldo += valor

    const novaTransferencia = { data: new Date(), numero_conta_origem, numero_conta_destino, valor };

    transferencias.push(novaTransferencia);

    return res.status(201).send();


}

const verificarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;
    const contaExistente = contas.find((conta) => {
        return conta.numero_conta === numero_conta;
    });

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' })
    };

    if (contaExistente.senha !== senha) {
        return res.status(404).json({ mensagem: 'Senha incorreta!' })
    };

    return res.status(201).json(contaExistente.saldo);

}

const verificarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;
    const contaExistente = contas.find((conta) => {
        return conta.numero_conta === numero_conta;
    });

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' })
    };

    if (contaExistente.senha !== senha) {
        return res.status(404).json({ mensagem: 'Senha incorreta!' })
    };

    const saquesConta = saques.filter((saque) => {
        return saque.numero_conta === numero_conta;
    });

    const depositosConta = depositos.filter((deposito) => {
        return deposito.numero_conta === numero_conta;
    });

    const transferenciasEnviadas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta;
    });

    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta;
    });


    return res.status(200).json({
        extrato: {
            saques: saquesConta,
            depositos: depositosConta,
            transferenciasEnviadas,
            transferenciasRecebidas

        }
    })
}

module.exports = {
    criarConta,
    listarContas,
    atualizarDadosContas,
    excluirConta,
    depositar,
    sacar,
    transferir,
    verificarSaldo,
    verificarExtrato
}