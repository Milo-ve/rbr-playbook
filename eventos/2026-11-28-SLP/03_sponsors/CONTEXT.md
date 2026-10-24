# 03_sponsors · sponsors, perks, factura y cobro

One job: llevar cada sponsor desde oportunidad hasta cobro, sin exponer montos.

## Inputs

- Working (este evento): ../EVENTO.md
- Working (este evento): ../00_alta/output/roles.md
- Reference (siempre): ../../../_playbook/pilares/sponsors/playbook.md
- Reference (siempre): ../../../_playbook/shared/privacidad.md

Do NOT load: sponsors o montos de otros eventos.

## Process

1. En `output/sponsors.md` lleva una fila por sponsor: nombre, estado comercial, etapa, perk y checklist de onboarding (logo, WhatsApp, media kit). **Sin montos.**
2. En `private/` (ignorado por git) lleva los montos presupuestado y cobrado, facturas y datos de cobro.
3. Un monto 0 es en especie, no cancelado. Un deal se cancela solo cuando se cae.
4. Cuando cambie el perk o la etapa, actualiza la fila y avisa a `02_adquisicion` y `04_operaciones`.

## Outputs

- sponsors.md → output/

## Human check

Verifica estado comercial y de cobro de cada sponsor contra lo que sabe Partnerships. Nada se envía ni se cobra sin tu aprobación.
