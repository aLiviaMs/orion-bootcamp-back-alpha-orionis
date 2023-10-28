export const composeResetEmailContent = (url: string): string => {
  const emailContent = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Recuperação de Senha</title>
      </head>
      <body>
        <table align="center" cellpadding="0" cellspacing="0" width="600">
          <tr>
            <td
              align="center"
              bgcolor="#ba8e73"
              style="
                padding: 20px 0;
                color: #ffffff;
                font-size: 24px;
                font-weight: bold;
              "
            >
              Recuperação de Senha
            </td>
          </tr>
          <tr>
            <td style="padding: 20px">
              <p>Olá,</p>
              <p>
                Recebemos uma solicitação de recuperação de senha para a sua conta.
                Para redefinir sua senha, clique no botão abaixo:
              </p>
              <table align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td bgcolor="#ba8e73" style="border-radius: 5px">
                    <a
                      href="${url}"
                      rel="noopener"
                      target="_blank"
                      style="
                        display: block;
                        padding: 15px 25px;
                        color: #ffffff;
                        text-align: center;
                        text-decoration: none;
                        font-weight: bold;
                      "
                      >Redefinir Senha</a
                    >
                  </td>
                </tr>
              </table>
              <p>
                Se você não solicitou essa recuperação de senha, ignore este email.
              </p>
              <p>O link de redefinição de senha é válido por 24 horas.</p>
              <p>
                Obrigado, <br />
                Orion Bootcamp - Projeto Marte
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>`;

  return emailContent;
};
