# 01_presupuesto · presupuesto y break even

One job: calcular cuánto cuesta el evento y cuánto se necesita de sponsors para no perder.

## Inputs

- Working (este evento): ../EVENTO.md
- Working (este evento): ../00_alta/output/roles.md
- Working (este evento): ../03_sponsors/output/sponsors.md (solo para saber qué está confirmado)
- Reference (siempre): ../../../_playbook/pilares/finanzas/playbook.md
- Reference (siempre): ../../../_playbook/variantes/community-led.md (si el modelo es community-led)

Do NOT load: `../03_sponsors/private/` (montos de sponsors) salvo que la persona los pida para comparar contra el break even.

## Process

1. Si no hay fecha, para: sin fecha no se presupuesta.
2. Pregunta en un solo mensaje: quién viaja y cuántas noches, precio del boleto, costo del venue y cortesías.
3. Calcula con las reglas del playbook; **muestra cada cuenta**. Ninguna cifra sale de cabeza.
4. Entrega costos por categoría en moneda local y USD, tickets netos, break even contra la meta y lo confirmado, y las alertas.
5. Valores que no estén en una fuente (comisión de Stripe, supuestos por ciudad) se marcan `por confirmar`.

## Outputs

- presupuesto.md → output/

## Human check

Revisa que cada línea tenga su cuenta y que el break even sea el número a conseguir. Solo con tu OK se marca T097.
