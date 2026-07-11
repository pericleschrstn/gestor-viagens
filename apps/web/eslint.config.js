import { nextJsConfig } from "@workspace/eslint-config/next-js"

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    // A fronteira "não importar infra" vale só para as camadas que não compõem
    // a infra (ui, domain e a app shell). application/actions/infra precisam
    // legitimamente importar infra, então não são incluídos aqui.
    files: [
      "features/**/ui/**/*.{ts,tsx}",
      "features/**/domain/**/*.{ts,tsx}",
      "app/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/features/*/infra/**"],
              message: "UI não deve importar camada infra.",
            },
          ],
        },
      ],
    },
  },
]
