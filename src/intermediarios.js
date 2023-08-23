const verificarBodyDeposito = (req, res, next) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ "mensagem": "O número da conta e o valor são obrigatórios!" });
    }
    next();
}

const verificarBodySaque = (req, res, next) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ "mensagem": "O número da conta, o valor e a senha são obrigatórios!" });
    }
    next();
}


const verificarBodySaldoeExtrato = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ "mensagem": "O número da conta e a senha são obrigatórios!" });
    }
    next();
}

const verificarBodyTransferencia = (req, res, next) => {
    const { numero_conta_origem, numero_conta_destino, senha, valor } = req.body;

    if (!numero_conta_origem) {
        return res.status(400).json({ "mensagem": "O número da conta de origem é obrigatório!" })
    };

    if (!numero_conta_destino) {
        return res.status(400).json({ "mensagem": "O número da conta de destino é obrigatório!" })
    };

    if (!senha) {
        return res.status(400).json({ "mensagem": "Senha obrigatória!" })
    };

    if (!valor) {
        return res.status(400).json({ "mensagem": "Informe o valor da transferência!" })
    }
    next();
}


module.exports = {
    verificarBodyDeposito,
    verificarBodySaque,
    verificarBodySaldoeExtrato,
    verificarBodyTransferencia

}