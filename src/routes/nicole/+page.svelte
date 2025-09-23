<svelte:head>
	<title>Nicole's Fabulous Page 💖 | University Bound! 🎓</title>
	<meta name="description" content="Celebrating Nicole's admission to University of Augsburg for International Management!" />
</svelte:head>

<div class="nicole-container">
	<div class="floating-hearts">
		<div class="heart">💕</div>
		<div class="heart">💖</div>
		<div class="heart">💗</div>
		<div class="heart">💝</div>
		<div class="heart">💘</div>
		<div class="heart">💞</div>
	</div>
	
	<div class="sparkles">
		<div class="sparkle">✨</div>
		<div class="sparkle">⭐</div>
		<div class="sparkle">🌟</div>
		<div class="sparkle">✨</div>
		<div class="sparkle">⭐</div>
		<div class="sparkle">🌟</div>
	</div>

	<h1 class="main-title">Welcome to Nicole's Kingdom! 👑</h1>
	
	<div class="subtitle-container">
		<p class="subtitle bouncing">The One, The Only, The Legendary...</p>
		<h2 class="name-title rainbow-text">NICOLE!</h2>
		<p class="funny-subtitle">*Dramatically gestures with jazz hands*</p>
	</div>

	<div class="university-announcement">
		<div class="announcement-badge">
			<div class="graduation-cap">🎓</div>
			<h2 class="announcement-title">BREAKING NEWS!</h2>
			<div class="celebration-emojis">
				<span class="emoji">🎉</span>
				<span class="emoji">🎊</span>
				<span class="emoji">📚</span>
				<span class="emoji">🏛️</span>
				<span class="emoji">🇩🇪</span>
			</div>
		</div>
		
		<div class="university-details">
			<h3 class="university-title shaking">Nicole Got Accepted!</h3>
			<p class="university-info">
				🌟 <strong>University of Augsburg</strong> 🌟<br>
				🎯 <strong>International Management</strong> 🎯<br>
				🚀 <strong>Future CEO in the making!</strong> 🚀
			</p>
			<div class="excitement-meter">
				<p class="excitement-text">Nicole's Excitement Level:</p>
				<div class="meter-bar">
					<div class="meter-fill">OUT OF HER MIND! 🤯</div>
				</div>
			</div>
			<p class="proud-message">
				So proud of you, sis! 🥺💕<br>
				<small>(Even though you'll probably boss me around with your fancy business degree)</small>
			</p>
		</div>
	</div>

	<div class="photo-container">
		<div class="photo-frame">
			<img src="/photos/misc/nicole.jpeg" alt="The fabulous Nicole" class="nicole-photo">
		</div>
		<div class="photo-caption">
			<p>"Looking absolutely stunning as always" - Your loving (and slightly jealous) brother 😏</p>
		</div>
	</div>

	<div class="fun-facts">
		<h3 class="wiggling">Fun Facts About Nicole:</h3>
		<ul class="facts-list">
			<li class="fact-item">🎭 Drama level: Oscar-worthy</li>
			<li class="fact-item">🍕 Pizza consumption: Legendary</li>
			<li class="fact-item">😴 Morning person: Absolutely not</li>
			<li class="fact-item">👗 Fashion sense: Actually pretty good (grudgingly admitted)</li>
			<li class="fact-item">🎵 Singing in shower: Neighbors know all the lyrics</li>
		</ul>
	</div>

	<div class="bottom-message">
		<p class="love-message pulsing">Made with love (and a healthy dose of sibling mockery) by your brother 💛</p>
	</div>
</div>

<style>
	:global(body) {
		background: linear-gradient(45deg, #ff6b9d, #c44569, #f8b500, #ff6348);
		background-size: 400% 400%;
		animation: gradientShift 8s ease infinite;
		min-height: 100vh;
		margin: 0;
		font-family: 'Comic Sans MS', cursive, system-ui;
	}

	@keyframes gradientShift {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}

	.nicole-container {
		position: relative;
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
		overflow-x: hidden;
	}

	.floating-hearts {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: 1;
	}

	.heart {
		position: absolute;
		font-size: 2rem;
		animation: floatHeart 6s linear infinite;
		opacity: 0.7;
	}

	.heart:nth-child(1) { left: 10%; animation-delay: 0s; animation-duration: 8s; }
	.heart:nth-child(2) { left: 25%; animation-delay: 2s; animation-duration: 6s; }
	.heart:nth-child(3) { left: 50%; animation-delay: 4s; animation-duration: 7s; }
	.heart:nth-child(4) { left: 75%; animation-delay: 1s; animation-duration: 9s; }
	.heart:nth-child(5) { left: 90%; animation-delay: 3s; animation-duration: 5s; }
	.heart:nth-child(6) { left: 35%; animation-delay: 5s; animation-duration: 8s; }

	@keyframes floatHeart {
		0% {
			transform: translateY(100vh) scale(0);
			opacity: 0;
		}
		10% {
			opacity: 0.7;
			transform: scale(1);
		}
		90% {
			opacity: 0.7;
		}
		100% {
			transform: translateY(-100px) scale(1);
			opacity: 0;
		}
	}

	.sparkles {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: 2;
	}

	.sparkle {
		position: absolute;
		font-size: 1.5rem;
		animation: sparkleAnimation 4s ease-in-out infinite;
	}

	.sparkle:nth-child(1) { top: 20%; left: 15%; animation-delay: 0s; }
	.sparkle:nth-child(2) { top: 35%; right: 20%; animation-delay: 1s; }
	.sparkle:nth-child(3) { top: 60%; left: 10%; animation-delay: 2s; }
	.sparkle:nth-child(4) { top: 80%; right: 15%; animation-delay: 0.5s; }
	.sparkle:nth-child(5) { top: 15%; left: 60%; animation-delay: 1.5s; }
	.sparkle:nth-child(6) { top: 70%; right: 50%; animation-delay: 2.5s; }

	@keyframes sparkleAnimation {
		0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
		50% { opacity: 1; transform: scale(1) rotate(180deg); }
	}

	.main-title {
		font-size: 3.5rem;
		color: #fff;
		text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
		margin: 2rem 0;
		animation: bounce 2s ease-in-out infinite;
		position: relative;
		z-index: 10;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-20px); }
	}

	.subtitle-container {
		margin: 2rem 0;
		position: relative;
		z-index: 10;
	}

	.subtitle {
		font-size: 1.5rem;
		color: #fff;
		text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
		margin: 1rem 0;
	}

	.bouncing {
		animation: subtleBounce 3s ease-in-out infinite;
	}

	@keyframes subtleBounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.name-title {
		font-size: 4rem;
		margin: 1rem 0;
		font-weight: bold;
		text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
	}

	.rainbow-text {
		background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
		background-size: 400% 400%;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: rainbow 3s linear infinite;
	}

	@keyframes rainbow {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}

	.funny-subtitle {
		font-size: 1rem;
		color: #fff;
		font-style: italic;
		opacity: 0.9;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
	}

	.photo-container {
		margin: 3rem 0;
		position: relative;
		z-index: 10;
	}

	.photo-frame {
		background: linear-gradient(45deg, #ffd700, #ffb6c1, #98fb98, #87ceeb);
		padding: 20px;
		border-radius: 20px;
		display: inline-block;
		transform: rotate(-2deg);
		animation: frameWiggle 4s ease-in-out infinite;
		box-shadow: 0 10px 30px rgba(0,0,0,0.3);
	}

	@keyframes frameWiggle {
		0%, 100% { transform: rotate(-2deg); }
		25% { transform: rotate(1deg); }
		75% { transform: rotate(-1deg); }
	}

	.nicole-photo {
		width: 300px;
		height: 300px;
		object-fit: cover;
		border-radius: 10px;
		box-shadow: 0 5px 15px rgba(0,0,0,0.2);
	}

	.photo-caption {
		margin-top: 1rem;
		font-size: 1.1rem;
		color: #fff;
		text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
		font-style: italic;
	}

	.university-announcement {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 2.5rem;
		border-radius: 25px;
		margin: 3rem 0;
		box-shadow: 0 15px 35px rgba(0,0,0,0.3);
		position: relative;
		z-index: 10;
		border: 4px solid #ffd700;
		animation: celebrationGlow 3s ease-in-out infinite;
		overflow: hidden;
	}

	@keyframes celebrationGlow {
		0%, 100% { 
			box-shadow: 0 15px 35px rgba(0,0,0,0.3), 0 0 20px rgba(255,215,0,0.5);
			transform: scale(1);
		}
		50% { 
			box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(255,215,0,0.8);
			transform: scale(1.02);
		}
	}

	.announcement-badge {
		text-align: center;
		margin-bottom: 2rem;
	}

	.graduation-cap {
		font-size: 4rem;
		animation: capFloat 2s ease-in-out infinite;
		display: block;
		margin-bottom: 1rem;
	}

	@keyframes capFloat {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-10px) rotate(5deg); }
	}

	.announcement-title {
		color: #ffd700;
		font-size: 2.5rem;
		font-weight: bold;
		text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
		margin: 1rem 0;
		animation: titleShine 2s ease-in-out infinite;
	}

	@keyframes titleShine {
		0%, 100% { text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
		50% { text-shadow: 2px 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.8); }
	}

	.celebration-emojis {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;
	}

	.celebration-emojis .emoji {
		font-size: 2rem;
		animation: emojiDance 1.5s ease-in-out infinite;
	}

	.celebration-emojis .emoji:nth-child(1) { animation-delay: 0s; }
	.celebration-emojis .emoji:nth-child(2) { animation-delay: 0.2s; }
	.celebration-emojis .emoji:nth-child(3) { animation-delay: 0.4s; }
	.celebration-emojis .emoji:nth-child(4) { animation-delay: 0.6s; }
	.celebration-emojis .emoji:nth-child(5) { animation-delay: 0.8s; }

	@keyframes emojiDance {
		0%, 100% { transform: translateY(0) scale(1); }
		50% { transform: translateY(-15px) scale(1.2); }
	}

	.university-details {
		background: rgba(255,255,255,0.95);
		padding: 2rem;
		border-radius: 20px;
		color: #333;
		position: relative;
	}

	.university-title {
		color: #c44569;
		font-size: 2.2rem;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.shaking {
		animation: shake 0.8s ease-in-out infinite;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-5px); }
		75% { transform: translateX(5px); }
	}

	.university-info {
		font-size: 1.3rem;
		text-align: center;
		line-height: 2;
		margin-bottom: 2rem;
	}

	.excitement-meter {
		margin: 2rem 0;
		text-align: center;
	}

	.excitement-text {
		font-size: 1.2rem;
		font-weight: bold;
		color: #c44569;
		margin-bottom: 1rem;
	}

	.meter-bar {
		background: #e0e0e0;
		border-radius: 25px;
		height: 50px;
		position: relative;
		overflow: hidden;
		border: 3px solid #c44569;
	}

	.meter-fill {
		background: linear-gradient(45deg, #ff6b9d, #c44569, #f8b500, #ff6348);
		background-size: 400% 400%;
		animation: gradientShift 2s ease infinite, meterFill 3s ease-out;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
		font-size: 1.1rem;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
	}

	@keyframes meterFill {
		0% { width: 0%; }
		100% { width: 100%; }
	}

	.proud-message {
		text-align: center;
		font-size: 1.2rem;
		color: #c44569;
		margin-top: 2rem;
		animation: heartPulse 2s ease-in-out infinite;
	}

	@keyframes heartPulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	.fun-facts {
		background: rgba(255,255,255,0.95);
		padding: 2rem;
		border-radius: 20px;
		margin: 3rem 0;
		box-shadow: 0 10px 30px rgba(0,0,0,0.2);
		position: relative;
		z-index: 10;
	}

	.fun-facts h3 {
		color: #c44569;
		font-size: 2rem;
		margin-bottom: 1.5rem;
	}

	.wiggling {
		animation: wiggle 3s ease-in-out infinite;
	}

	@keyframes wiggle {
		0%, 100% { transform: rotate(0deg); }
		25% { transform: rotate(-3deg); }
		75% { transform: rotate(3deg); }
	}

	.facts-list {
		list-style: none;
		padding: 0;
		font-size: 1.2rem;
	}

	.fact-item {
		margin: 1rem 0;
		color: #333;
		animation: slideIn 0.8s ease-out;
		animation-fill-mode: both;
	}

	.fact-item:nth-child(1) { animation-delay: 0.2s; }
	.fact-item:nth-child(2) { animation-delay: 0.4s; }
	.fact-item:nth-child(3) { animation-delay: 0.6s; }
	.fact-item:nth-child(4) { animation-delay: 0.8s; }
	.fact-item:nth-child(5) { animation-delay: 1.0s; }

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-50px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.bottom-message {
		margin: 3rem 0;
		position: relative;
		z-index: 10;
	}

	.love-message {
		font-size: 1.3rem;
		color: #fff;
		text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
		background: rgba(0,0,0,0.2);
		padding: 1.5rem;
		border-radius: 15px;
		display: inline-block;
	}

	.pulsing {
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	@media (max-width: 600px) {
		.main-title { font-size: 2.5rem; }
		.name-title { font-size: 3rem; }
		.nicole-photo { width: 250px; height: 250px; }
		.nicole-container { padding: 1rem; }
	}
</style>