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

### Arrastre múltiple de iconos (pendiente de probar)

**Estado:** Implementado, pendiente de testing

**Descripción:** Cuando se seleccionan varios iconos con el cajón de selección y se arrastra uno, todos los seleccionados se mueven juntos manteniendo sus posiciones relativas.

**Archivos modificados:**
- `src/components/Draggable.svelte` - Lógica de arrastre múltiple
- `src/components/Main.svelte` - Función `dropDesktopIcon` para mover múltiples iconos
- `src/stores/desktopIcons.ts` - `getNewCoordinatesInNewFolder` con parámetro `offsetIndex`

**Comportamiento esperado:**
- Arrastrar icono seleccionado → mueve todos los seleccionados
- Arrastrar icono NO seleccionado → deselecciona otros y mueve solo ese
- Posiciones relativas se mantienen en el escritorio
- Al mover a carpeta, se colocan secuencialmente

**Para probar:** `npm run dev` → seleccionar varios iconos → arrastrar uno
