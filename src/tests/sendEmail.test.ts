import { sendEmail } from '../utils/email';
import nodemailer from 'nodemailer';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn()
  })
}));

const mockedSendMail = nodemailer.createTransport().sendMail as jest.Mock;

describe('sendEmail', () => {
  let consoleSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('deve enviar email', async () => {
    mockedSendMail.mockResolvedValue({
      accepted: ['teste@examplo.com']
    });

    const result: boolean = await sendEmail(
      'endereço@exemplo.com',
      'Assunto Teste',
      '<p>Email de Teste</p>'
    );

    expect(result).toBe(true);
    expect(mockedSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'endereço@exemplo.com',
        subject: 'Assunto Teste',
        html: '<p>Email de Teste</p>'
      })
    );
  });

  it('deve retornar erro ao enviar email', async () => {
    mockedSendMail.mockRejectedValue(new Error('Erro ao enviar email'));

    const result: boolean = await sendEmail(
      'endereço@exemplo.com',
      'Assunto Teste',
      '<p>Email de Teste</p>'
    );

    expect(result).toBe(false);
  });
});
