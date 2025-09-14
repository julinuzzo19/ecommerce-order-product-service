# Entity (Tiene identidad)

Pregunta clave: "¿Tiene un ID único y puede cambiar en el tiempo manteniendo su identidad?"

# Value Object (Se define por su valor)

Pregunta clave: "¿Se define completamente por sus atributos? ¿Es inmutable?"

# Domain Service (Lógica que no pertenece a ninguna Entity)

Pregunta clave: "¿Esta lógica involucra múltiples entities o es un proceso del dominio que no encaja naturalmente en una entity?"

<!--  -->

# 🎯 Resumen como checklist

Identidad estable (ID, historia, seguimiento)?
→ Entidad

Reemplazable por valores iguales, sin historia?
→ Value Object

Varias entidades/VO que deben cumplir reglas juntas, en la misma transacción?
→ Agregado (elige raíz)

Necesito consultar/persistir por separado?
→ Repository para la raíz del agregado

# 🔑 Observaciones críticas

<!-- - Agregado pequeño: -->

Compra NO contiene al Cliente ni al Producto, solo referencias (IDs) y snapshots.

Esto evita un mega-agregado que bloquee todo.

<!-- - Value Objects embebidos: -->

Email, Address, Money, PurchaseItem.

No llevan repositorio.

<!-- - Repositorios SOLO en raíces: -->

ClientRepository, ProductRepository, PurchaseRepository.

❌ Nada como PurchaseItemRepository.

<!-- Invariantes claras por agregado: -->

Cliente: reglas sobre email, direcciones.

Producto: stock no puede ser negativo.

Compra: total = suma ítems, no se puede pagar vacía.

# Así se ve el flujo

Cliente hace una Compra.

Compra referencia a Producto y a Cliente por ID, guarda snapshots de Producto en PurchaseItem.

Si hay regla de stock, se coordina con Producto mediante evento/command, no metiendo Producto adentro del agregado Compra.
