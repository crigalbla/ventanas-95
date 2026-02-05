# Ventanas 95

Recreación web del sistema operativo Windows 95 con funcionalidad interactiva.

## Stack Tecnológico

- **Astro 3.2.3** - Framework principal
- **Svelte 4.2.1** - Componentes reactivos
- **Tailwind CSS 3.3.3** - Estilos
- **TypeScript** - Tipado con JSDoc

## Comandos

```bash
npm run dev          # Servidor de desarrollo (localhost:4321)
npm run build        # Compilar para producción
npm run preview      # Vista previa de producción
npm run lint --fix   # Lint y formateo de código
```

## Estructura del Proyecto

```
src/
├── components/           # Componentes Svelte
│   ├── windowBodies/     # Contenido de cada ventana
│   ├── Window.svelte     # Wrapper base de ventanas
│   ├── Draggable.svelte  # Lógica de arrastre
│   └── Resize.svelte     # Lógica de redimensionamiento
├── stores/               # Estado global (Svelte stores)
│   ├── desktopIcons.ts   # Iconos del escritorio
│   ├── windows.ts        # Gestión de ventanas
│   ├── user.ts           # Datos del usuario
│   ├── multiDrag.ts      # Estado del arrastre múltiple (NUEVO)
│   └── rightClickMenu.ts # Menú contextual
├── games/tetris/         # Juego Tetris
├── i18n/                 # Traducciones (ES/EN)
├── constants/            # Constantes compartidas
├── utils/                # Funciones utilitarias
├── layouts/              # Layouts de Astro
└── pages/                # Páginas (index.astro)
```

## Convenciones de Código

- Usar JSDoc para documentación de tipos
- Seguir configuración de ESLint existente
- Componentes Svelte en PascalCase
- Stores y utils en camelCase
- Mantener el estilo visual retro de Windows 95

## Cómo Agregar Nuevas Ventanas

1. Crear el componente del body en `src/components/windowBodies/`
2. Agregar el tipo de ventana en `src/constants/windowTypes.ts`
3. Registrar en el store de windows si es necesario
4. Crear icono correspondiente en `src/constants/icons.ts`

## Cómo Agregar Traducciones

1. Editar archivos en `src/i18n/`
2. Agregar claves tanto en español como en inglés
3. Usar la función de traducción `t()` en los componentes

## Notas Importantes

- Las ventanas usan `Window.svelte` como wrapper
- El sistema de iconos soporta drag & drop, selección múltiple y menú contextual
- El proyecto es responsive pero requiere orientación horizontal en móviles

---

## Trabajo en Progreso

### Arrastre múltiple de iconos

**Estado:** Funcional con 1 bug pendiente

**Descripción:** Cuando se seleccionan varios iconos con el cajón de selección y se arrastra uno, todos los seleccionados se mueven juntos manteniendo sus posiciones relativas.

**Archivos modificados:**
- `src/components/Draggable.svelte` - Lógica de arrastre múltiple con fantasmas sincronizados
- `src/components/Main.svelte` - Función `dropDesktopIcon` para mover múltiples iconos + lógica para no deseleccionar al arrastrar
- `src/components/DesktopIcon.svelte` - Deselecciona otros iconos al hacer clic en uno no seleccionado
- `src/stores/desktopIcons.ts` - `getNewCoordinatesInNewFolder` con parámetro `excludeIds` para posicionamiento correcto
- `src/stores/multiDrag.ts` - **NUEVO** Store para coordinar el arrastre múltiple entre componentes
- `src/utils/index.ts` - Fix para `isMobileOrTablet` (verificación de `document`)

**Bugs corregidos en esta sesión:**
1. ✅ Error de compilación: `document is not defined` en `isMobileOrTablet`
2. ✅ Fantasmas secundarios no se mostraban durante el arrastre múltiple
3. ✅ Al hacer clic en un icono fuera de la selección, se sumaba a los seleccionados en lugar de mover solo ese
4. ✅ Fantasmas no desaparecían al soltar iconos en una carpeta abierta
5. ✅ Hueco grande entre iconos al mover múltiples a una carpeta (problema con posicionamiento)
6. ✅ El icono arrastrado directamente no se movía dentro de carpetas (usaba `updateParams` que dependía de `canBeDropped`)
7. ✅ Al soltar iconos dentro de carpeta, solo quedaba seleccionado el arrastrado directamente

**Bug pendiente:**
- **Cursor incorrecto en iconos secundarios:** Al arrastrar múltiples iconos dentro de una carpeta, solo el icono que se arrastra directamente muestra el cursor correcto. Los otros iconos fantasma muestran el cursor de "prohibido" aunque todo funciona bien. El problema es que cada icono tiene su propio `canBeDropped` y los secundarios no usan el valor del icono principal.
  - **Intento fallido:** Se intentó agregar `canBeDropped` al store `multiDrag` pero no funcionó. Revisar por qué el valor no se propaga correctamente a los iconos secundarios.
  - **Archivos relevantes:** `src/stores/multiDrag.ts`, `src/components/Draggable.svelte` (línea ~361 donde se usa `canBeDropped` en el fantasma secundario)

**Comportamiento actual (funcionando):**
- Arrastrar icono seleccionado → mueve todos los seleccionados con fantasmas visibles
- Arrastrar icono NO seleccionado → deselecciona otros y mueve solo ese
- Posiciones relativas se mantienen en el escritorio
- Al mover a carpeta, se colocan secuencialmente sin huecos
- Iconos permanecen seleccionados después de mover dentro de carpeta

**Para continuar:** `npm run dev` → probar el bug del cursor en arrastre múltiple dentro de carpetas
