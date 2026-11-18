# 🎬 Sistema de Animações Motion — Devs From Tomorrow

Este módulo padroniza as animações declarativas dos componentes React da plataforma, garantindo performance de 60fps, transições consistentes com a identidade visual da marca e conformidade com acessibilidade (**WCAG 2.1 — Redução de Movimento**).

---

## 📦 1. Importação Padrão

```tsx
import { motion, VARIANTS, TRANSITIONS, useReducedMotion } from '@/motion';
```

---

## 🎨 2. Padrões de Uso Declarativo

### A. Elemento animado ao entrar na tela (`whileInView`)
Utilize `whileInView="visible"` com `initial="hidden"` e `viewport={{ once: true }}`:

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={VARIANTS.fadeInUp}
>
  <h2>Soluções com IA e Automação</h2>
</motion.div>
```

### B. Efeito cascata para listas de itens (`staggerContainer`)
Envolva a lista ou grid com `staggerContainer`:

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={VARIANTS.staggerContainer(0.12, 0.1)}
  className="grid-cards"
>
  {cards.map((card) => (
    <motion.div
      key={card.id}
      variants={VARIANTS.fadeInUp}
      whileHover={VARIANTS.cardHover.hover}
      className="glass-card"
    >
      <h3>{card.title}</h3>
    </motion.div>
  ))}
</motion.div>
```

### C. Micro-interações táteis em botões (`whileHover` & `whileTap`)
```tsx
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={VARIANTS.buttonTap.tap}
  className="btn btn-primary"
>
  Solicitar Orçamento
</motion.button>
```

---

## ♿ 3. Acessibilidade e Fallback para Redução de Movimento

O sistema implementa **dupla camada de proteção** para usuários que ativaram a preferência de redução de movimento no sistema operacional (`prefers-reduced-motion: reduce`):

1. **Camada React (`useReducedMotion`)**:
   - Detecta automaticamente a flag do sistema operacional em tempo real.
   - O `motionComponents` intercepta as variantes e cancela qualquer translação de eixos (`x`, `y`), rotações ou escalas agressivas, substituindo-as por transições de opacidade instantâneas ou ultra-suaves.
2. **Camada CSS Global ([resources/css/index.css](file:///c:/Users/migue/Downloads/Original_Projeto/DFT2/resources/css/index.css))**:
   - Força `animation-duration: 0.01ms !important;` e `transition-duration: 0.01ms !important;` em todos os elementos caso a redução de movimento esteja ativada no navegador.

---

## 📐 4. Variantes Disponíveis (`VARIANTS`)

* **`VARIANTS.fadeIn`**: Aparecimento suave por opacidade.
* **`VARIANTS.fadeInUp`**: Fade in subindo (+28px para 0).
* **`VARIANTS.fadeInDown`**: Fade in descendo (-24px para 0).
* **`VARIANTS.fadeInScale`**: Fade in com expansão (scale 0.94 para 1).
* **`VARIANTS.slideInLeft`**: Deslizar da esquerda para a direita.
* **`VARIANTS.slideInRight`**: Deslizar da direita para a esquerda.
* **`VARIANTS.staggerContainer(delay, start)`**: Cascata para elementos filhos.
* **`VARIANTS.cardHover`**: Elevação tátil suave em cards (-6px de elevação).
* **`VARIANTS.buttonTap`**: Feedback tátil de clique em botões (scale 0.97).
