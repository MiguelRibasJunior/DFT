import React from 'react';
import { useCookieConsent } from '../../hooks/useCookieConsent';

/**
 * Banner de consentimento de cookies de análise (LGPD).
 *
 * - Só existe se houver analytics configurado no admin (em produção): sem isso o site usa apenas
 *   cookies técnicos, que não pedem consentimento.
 * - "Aceitar" e "Recusar" têm o mesmo tamanho, o mesmo estilo e a mesma facilidade de acesso.
 * - Não rouba o foco nem bloqueia a página; fica no começo do DOM, então quem navega por teclado
 *   chega nele primeiro e consegue decidir sem percorrer o site inteiro.
 * - Depois da escolha some; o rodapé tem "Preferências de cookies" para mudar de ideia.
 */
export const CookieBanner: React.FC = () => {
  const { bannerVisible, choice, accept, reject } = useCookieConsent();

  if (!bannerVisible) return null;

  return (
    <div className="cookie-banner" role="region" aria-labelledby="cookie-banner-title">
      <div className="cookie-banner__text">
        <h2 id="cookie-banner-title" className="cookie-banner__title">
          Cookies e privacidade
        </h2>
        <p>
          Usamos cookies técnicos, necessários para o site funcionar. Com a sua permissão, usamos também cookies de
          análise do Google para entender como o site é usado e melhorá-lo. Eles só são ativados se você aceitar, e
          você pode mudar de ideia quando quiser em &ldquo;Preferências de cookies&rdquo;, no rodapé. Saiba mais na{' '}
          <a href="/privacidade">Política de Privacidade</a>.
        </p>
        {choice && (
          <p className="cookie-banner__current">
            Sua escolha atual: {choice === 'accepted' ? 'cookies de análise aceitos' : 'cookies de análise recusados'}.
          </p>
        )}
      </div>

      <div className="cookie-banner__actions">
        <button type="button" className="btn btn-secondary cookie-banner__button" onClick={reject}>
          Recusar
        </button>
        <button type="button" className="btn btn-secondary cookie-banner__button" onClick={accept}>
          Aceitar cookies de análise
        </button>
      </div>
    </div>
  );
};
