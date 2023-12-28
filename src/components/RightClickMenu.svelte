<script lang="ts">
  import type { SectionInRightClickMenuType } from "@/stores"
  import { RIGHT_CLICK_MENU_ID, SUB_RIGHT_CLICK_MENU_ID } from "@/constants"
  import { afterUpdate, onMount } from "svelte"
  import { t } from "@/i18n"

  type SubOption= { text: string, isDisabled?: boolean, sections?: string[][] }

  export let sections: SectionInRightClickMenuType[]
  export let top: number
  export let left: number

  const buttonHeight = 24
  const separatorHeight = 12
  let isMenuReady = false
  let isSubMenuReady = false
  let menuRef: HTMLElement
  let subMenuRef: HTMLElement
  let topSubMenu: number
  let leftSubMenu: number
  let subOption: SubOption

  const getHeightUntilThisOption = (option: SubOption): number => {
  	let totalOptionsUntilThis = 0
  	let totalSectionsUntilThis = 0

  	sections.find((s: SectionInRightClickMenuType) => {
  		const indexOfThis = s.indexOf(option)
  		if (indexOfThis >= 0) {
  			totalOptionsUntilThis += indexOfThis
  			return true
  		} else {
  			totalOptionsUntilThis += s.length
  			totalSectionsUntilThis += 1
  		}
  	})

  	return (buttonHeight * totalOptionsUntilThis) + (separatorHeight * totalSectionsUntilThis)
  }

  const onClick = (option: SubOption) => {
  	if (!option.isDisabled) {
  		console.log($t(option.text))
  	}
  }

  const onMouseOver = (option: SubOption) => {
  	isSubMenuReady = false
  	if (!option.isDisabled && option.sections?.length) {
  		subOption = option
  		topSubMenu = top + getHeightUntilThisOption(option)
  		leftSubMenu = left + menuRef.offsetWidth
  	} else {
  		subOption = undefined!
  	}
  }

  onMount(() => {
  	const checkIfMenuFitsOnScreen = () => {
  		const rect = menuRef.getBoundingClientRect()
  		const isOutsideX = rect.right > window.innerWidth
  		const isOutsideY = rect.bottom > window.innerHeight

  		if (isOutsideX) left = left - rect.width
  		if (isOutsideY) top = window.innerHeight - rect.height

  		isMenuReady = true
  	}

  	checkIfMenuFitsOnScreen()
  })

  afterUpdate(() => {
  	if (!isSubMenuReady && subMenuRef) {
  		const checkIfSubMenuFitsOnScreen = () => {
  			const rect = subMenuRef.getBoundingClientRect()
  			const isOutsideX = rect.right > window.innerWidth
  			const isOutsideY = rect.bottom > window.innerHeight

  			if (isOutsideX) {
  				leftSubMenu = left - rect.width + 4
  			} else {
  				leftSubMenu = leftSubMenu - 4
  			}
  			if (isOutsideY) topSubMenu = window.innerHeight - rect.height

  			isSubMenuReady = true
  		}

  		checkIfSubMenuFitsOnScreen()
  	}
  })
</script>

<section
  class="background-silver border-color-shadow-up right-click-menu absolute"
  class:not-ready={!isMenuReady}
  id={RIGHT_CLICK_MENU_ID}
  style="--left:{left}; --top:{top};"
  bind:this={menuRef}
>
  {#each sections as options, i}
    {#each options as option}
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <button
      class="option-button"
      class:option-disabled={option.isDisabled}
      style="--button-height:{buttonHeight};"
      on:click={() => onClick(option)}
      on:mouseover={() => onMouseOver(option)}
    >
      <span class="pointer-events-none">{$t(option.text)}</span>
      {#if option.sections?.length}
        <span class="pointer-events-none triangle" />
      {/if}
    </button>
    {/each}
    {#if sections.length - 1 !== i}
      <div class="separator border-color-soft-down" />
    {/if}
  {/each}
</section>

<!-- SubMenu -->
{#if subOption?.sections}
  <section
    class="background-silver border-color-shadow-up sub-menu absolute"
    class:not-ready={!isSubMenuReady}
    id={SUB_RIGHT_CLICK_MENU_ID}
    style="--leftSubMenu:{leftSubMenu}; --topSubMenu:{topSubMenu};"
    bind:this={subMenuRef}
  >
    {#each subOption.sections as options, i}
      {#each options as option}
        <button
          class="option-button"
          on:click={() => onClick({ text: option })}
        >
          <span>{$t(option)}</span>
        </button>
      {/each}
      {#if subOption.sections.length - 1 !== i}
        <div class="separator border-color-soft-down" />
      {/if}
    {/each}
  </section>
{/if}

<style>
  .not-ready {
    opacity: 0;
  }

  .option-button {
    display: flex;
    align-items: center;
    width: 100%;
    height: calc(var(--button-height) * 1px);
    padding: 0px 24px;
    border: none;
    outline: none;
  }

  .option-button:hover {
    background-color: #0000aa;
  }

  .option-button:hover:not(.option-disabled) {
    color: white;
  }

  .option-disabled {
    color: rgb(107 114 128)
  }

  .right-click-menu {
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    z-index: 1000;
    padding: 2px 1px;
  }

  .sub-menu {
    top: calc(var(--topSubMenu) * 1px);
    left: calc(var(--leftSubMenu) * 1px);
    width: max-content;
    z-index: 1001;
    padding: 2px 1px;
  }

  .triangle {
    position: absolute;
    right: 5px;
    width: 15px;
    height: 15px;
    background-size: 10px;
    background-repeat: no-repeat;
    background-position: 5px 1px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="rgba(0, 0, 0, 1)"><polygon points="0,0 0,100 50,50"/></svg>');
  }

  .option-disabled .triangle {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="rgba(0, 0, 0, 0.3)"><polygon points="0,0 0,100 50,50"/></svg>');
  }

  .option-button:hover:not(.option-disabled) .triangle {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="rgba(255, 255, 255, 1)"><polygon points="0,0 0,100 50,50"/></svg>');
  }

  .separator {
    margin: 4px 0px;
    width: 100%;
  }
</style>
