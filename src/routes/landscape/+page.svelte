<script>
  import { onMount } from 'svelte';
  
  let tiles = Array(80).fill(null);
  let showModal = false;
  let selectedTileIndex = null;
  let promptText = '';
  let isGenerating = false;
  let errorMessage = '';
  
  onMount(() => {
    loadTiles();
  });
  
  async function loadTiles() {
    try {
      const response = await fetch('/api/tiles');
      if (response.ok) {
        const data = await response.json();
        // Reset tiles array
        tiles = Array(80).fill(null);
        // Fill in the tiles from database
        data.forEach(tile => {
          if (tile.position >= 0 && tile.position < 80) {
            tiles[tile.position] = {
              image_url: tile.image_url,
              prompt: tile.prompt
            };
          }
        });
      }
    } catch (error) {
      console.error('Failed to load tiles:', error);
    }
  }
  
  function openModal(index) {
    selectedTileIndex = index;
    promptText = '';
    showModal = true;
    errorMessage = '';
  }
  
  function getNeighborTiles(index) {
    const neighbors = {};
    const row = Math.floor(index / 10);
    const col = index % 10;

    // Top neighbor
    if (row > 0) {
      const topIndex = (row - 1) * 10 + col;
      if (tiles[topIndex] && tiles[topIndex].image_url) {
        neighbors.top = tiles[topIndex].image_url;
      }
    }

    // Right neighbor
    if (col < 9) {
      const rightIndex = row * 10 + (col + 1);
      if (tiles[rightIndex] && tiles[rightIndex].image_url) {
        neighbors.right = tiles[rightIndex].image_url;
      }
    }

    // Bottom neighbor
    if (row < 7) {
      const bottomIndex = (row + 1) * 10 + col;
      if (tiles[bottomIndex] && tiles[bottomIndex].image_url) {
        neighbors.bottom = tiles[bottomIndex].image_url;
      }
    }

    // Left neighbor
    if (col > 0) {
      const leftIndex = row * 10 + (col - 1);
      if (tiles[leftIndex] && tiles[leftIndex].image_url) {
        neighbors.left = tiles[leftIndex].image_url;
      }
    }

    return neighbors;
  }

  async function generateImage() {
    if (!promptText.trim() || isGenerating) return;

    isGenerating = true;

    try {
      // Get neighboring tiles
      const neighbors = getNeighborTiles(selectedTileIndex);

      // Call the generate image API with neighbor context
      const generateResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: promptText.trim(),
          size: '128x128',
          style: 'pixel-art',
          neighbors: neighbors
        })
      });
      
      if (!generateResponse.ok) {
        throw new Error('Failed to generate image');
      }
      
      const { imageUrl } = await generateResponse.json();
      
      // Save the tile to database
      const saveResponse = await fetch('/api/tiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          position: selectedTileIndex,
          image_url: imageUrl,
          prompt: promptText.trim()
        })
      });
      
      if (!saveResponse.ok) {
        throw new Error('Failed to save tile');
      }
      
      // Update the local tiles array
      tiles[selectedTileIndex] = {
        image_url: imageUrl,
        prompt: promptText.trim()
      };
      
      // Close modal
      showModal = false;
      selectedTileIndex = null;
      promptText = '';
      
    } catch (error) {
      console.error('Generation failed:', error);
      errorMessage = 'Oops something went wrong';
      showModal = false;
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        errorMessage = '';
      }, 3000);
    } finally {
      isGenerating = false;
    }
  }
  
  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      generateImage();
    }
  }
  
  function closeModal() {
    if (!isGenerating) {
      showModal = false;
      selectedTileIndex = null;
      promptText = '';
    }
  }
</script>

<style>
  /* :global(body) {
    overflow: hidden;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  } */
  
  .container {
    position: relative;
    /* width: 100vw;
    height: 100vh; */
    /* background: #F5F5DC; */
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 50px;
  }

  .grid {
    --tile-size: min(10vw, 12.5vh);
    display: grid;
    grid-template-columns: repeat(10, var(--tile-size));
    grid-template-rows: repeat(8, var(--tile-size));
    gap: 0;
    padding: 0;
    width: calc(10 * var(--tile-size));
    height: calc(8 * var(--tile-size));
  }

  .tile {
    background: rgba(212, 165, 116, 0.3);
    border: none;
    border-radius: 0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s ease;
    box-shadow: none;
    padding: 0;
    overflow: hidden;
  }

  .tile:hover {
    background: rgba(193, 154, 107, 0.5);
    transform: none;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .tile.filled {
    padding: 0;
    background: transparent;
  }

  .tile.filled:hover {
    background: transparent;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .tile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .tile-plus {
    font-size: 48px;
    color: #8B7355;
    line-height: 1;
    margin-bottom: 8px;
  }
  
  .tile-text {
    font-size: 12px;
    color: #6B5D54;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .modal-box {
    width: 400px;
    padding: 24px;
    background: #F5E6D3;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .modal-title {
    color: #5D4E37;
    font-size: 24px;
    margin: 0 0 16px 0;
    font-weight: 600;
  }
  
  .modal-textarea {
    width: 100%;
    height: 100px;
    padding: 12px;
    border: 2px solid #D4A574;
    border-radius: 8px;
    resize: none;
    font-family: inherit;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
  }
  
  .modal-textarea:focus {
    outline: none;
    border-color: #8FBC8F;
  }
  
  .modal-button {
    background: #8FBC8F;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    margin-top: 16px;
    width: 100%;
    transition: all 0.3s ease;
  }
  
  .modal-button:hover:not(:disabled) {
    background: #7DA87D;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(143, 188, 143, 0.3);
  }
  
  .modal-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .error-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    color: #CD5C5C;
    font-size: 14px;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    animation: slideDown 0.3s ease;
  }
  
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
</style>

<div class="container">
  <div class="grid">
    {#each tiles as tile, index}
      <button 
        class="tile {tile ? 'filled' : ''}"
        on:click={() => openModal(index)}
      >
        {#if tile && tile.image_url}
          <img 
            src={tile.image_url} 
            alt={tile.prompt || 'Generated landscape tile'} 
            class="tile-image"
          />
        {:else}
          <span class="tile-plus">+</span>
          <span class="tile-text">Add image</span>
        {/if}
      </button>
    {/each}
  </div>
  
  {#if showModal}
    <div class="modal-overlay" on:click={closeModal}>
      <div class="modal-box" on:click|stopPropagation>
        <h2 class="modal-title">Create your landscape</h2>
        <textarea
          class="modal-textarea"
          placeholder="Describe your pixel art landscape tile..."
          bind:value={promptText}
          on:keydown={handleKeyPress}
          disabled={isGenerating}
        />
        <button 
          class="modal-button"
          on:click={generateImage}
          disabled={isGenerating || !promptText.trim()}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  {/if}
  
  {#if errorMessage}
    <div class="error-message">
      {errorMessage}
    </div>
  {/if}
</div>