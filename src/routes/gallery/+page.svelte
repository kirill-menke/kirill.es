<script>

  const photos = [
    { src: '/photos/geneva/IMG_2251.webp', alt: 'Geneva Photo 1' },
    { src: '/photos/geneva/IMG_2252.webp', alt: 'Geneva Photo 2' },
    { src: '/photos/geneva/IMG_2255.webp', alt: 'Geneva Photo 3' },
    { src: '/photos/geneva/IMG_2257.webp', alt: 'Geneva Photo 4' },
    { src: '/photos/geneva/IMG_2260.webp', alt: 'Geneva Photo 5' },
    { src: '/photos/geneva/IMG_2265.webp', alt: 'Geneva Photo 6' },
    { src: '/photos/geneva/IMG_2266.webp', alt: 'Geneva Photo 7' },
    { src: '/photos/geneva/IMG_2269.webp', alt: 'Geneva Photo 8' },
    { src: '/photos/geneva/IMG_2280.webp', alt: 'Geneva Photo 9' },
    { src: '/photos/geneva/IMG_2282.webp', alt: 'Geneva Photo 10' },
    { src: '/photos/geneva/IMG_2283.webp', alt: 'Geneva Photo 11' },
    { src: '/photos/geneva/IMG_2285.webp', alt: 'Geneva Photo 12' },
    { src: '/photos/geneva/IMG_2292.webp', alt: 'Geneva Photo 13' },
    { src: '/photos/geneva/IMG_2302.webp', alt: 'Geneva Photo 14' },
    { src: '/photos/geneva/IMG_2308.webp', alt: 'Geneva Photo 15' },
    { src: '/photos/geneva/IMG_2310.webp', alt: 'Geneva Photo 16' },
    { src: '/photos/geneva/IMG_2315.webp', alt: 'Geneva Photo 17' },
    { src: '/photos/geneva/IMG_2319.webp', alt: 'Geneva Photo 18' },
  ];

  // Group photos into rows with alternating patterns
  function groupPhotosIntoRows(photos) {
    const rows = [];
    let i = 0;
    let rowType = 0; // Alternate between row types
    
    while (i < photos.length) {
      if (rowType % 2 === 0 && i + 2 < photos.length) {
        // Three-tile row: 2 square + 1 rectangular
        rows.push({
          type: 'three',
          photos: [
            { ...photos[i], tileType: 'square' },
            { ...photos[i + 1], tileType: 'square' },
            { ...photos[i + 2], tileType: 'rectangular' }
          ]
        });
        i += 3;
      } else if (i + 1 < photos.length) {
        // Two-tile row: 2 rectangular
        rows.push({
          type: 'two',
          photos: [
            { ...photos[i], tileType: 'rectangular' },
            { ...photos[i + 1], tileType: 'rectangular' }
          ]
        });
        i += 2;
      } else {
        // Handle remaining single photo as rectangular
        rows.push({
          type: 'single',
          photos: [
            { ...photos[i], tileType: 'rectangular-full' }
          ]
        });
        i += 1;
      }
      rowType++;
    }
    
    return rows;
  }

  $: photoRows = groupPhotosIntoRows(photos);
</script>

<div class="gallery-container">
  {#each photoRows as row}
    <div class="photo-row {row.type}-tiles">
      {#each row.photos as photo}
        <div class="photo-tile {photo.tileType}">
          <img src={photo.src} alt={photo.alt} />
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .gallery-container {
    width: 100%;
    min-height: 100%;
    margin: 20px;
    background-color: #f5f5f5;
  }

  .photo-row {
    display: flex;
    width: 100%;
    gap: 10px;
    margin-bottom: 10px;
  }

  .photo-tile {
    position: relative;
    overflow: hidden;
    /* flex-shrink: 0; */
  }

  .photo-tile img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  /* Three-tile row: 2 squares + 1 rectangular */
  .three-tiles {
    height: calc((100vw - 8px) / 3);
  }

  .three-tiles .square {
    width: calc((100vw - 8px) / 3);
    height: calc((100vw - 8px) / 3);
  }

  .three-tiles .rectangular {
    width: calc((100vw - 8px) / 3);
    height: calc((100vw - 8px) / 3);
  }

  /* Two-tile row: 2 rectangular tiles */
  .two-tiles {
    height: calc((100vw - 4px) / 4);
  }

  .two-tiles .rectangular {
    width: calc((100vw - 4px) / 2);
    height: calc((100vw - 4px) / 4);
  }

  /* Single tile row (fallback for odd number of photos) */
  .single-tiles {
    height: calc(100vw / 4);
  }

  .single-tiles .rectangular-full {
    width: 100vw;
    height: calc(100vw / 4);
  }

  /* Responsive adjustments for larger screens */
  @media (min-width: 1200px) {
    .three-tiles {
      height: 400px;
    }

    .three-tiles .square {
      width: calc((100vw - 8px) / 3);
      height: 400px;
    }

    .three-tiles .rectangular {
      width: calc((100vw - 8px) / 3);
      height: 400px;
    }

    .two-tiles {
      height: 300px;
    }

    .two-tiles .rectangular {
      width: calc((100vw - 4px) / 2);
      height: 300px;
    }

    .single-tiles {
      height: 300px;
    }

    .single-tiles .rectangular-full {
      width: 100vw;
      height: 300px;
    }
  }

  /* Remove default body margins */
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>