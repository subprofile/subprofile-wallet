import { css } from '@emotion/react';
import 'tailwind.css';

export const globalStyles = css`
  // Fix border style when disable Tailwind prelight-mode
  // https://stackoverflow.com/questions/23218345/3px-border-automatically-added-when-using-border-style-without-specifying-border
  *,
  :after,
  :before {
    border: 0 solid;
  }

  html,
  body,
  #root {
    height: 100%;
    display: flow-root;
  }

  ::selection {
    background-color: rgba(79, 170, 245, 0.3);
  }

  .MuiDialog-root {
    .MuiDialog-container {
      align-items: flex-start;

      @media (min-width: 600px) {
        .MuiPaper-root {
          margin-top: 64px;
        }
      }
    }
  }

  p {
    margin-top: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    line-height: 1.2;
    font-weight: 700;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.625rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.25rem;
  }

  h5 {
    font-size: 1.125rem;
  }

  h6 {
    font-size: 1rem;
  }
`;
