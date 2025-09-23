<script>
	import { onMount } from 'svelte';
	
	let catCount = 2;
	let daysAlive = 4;
	let swissChocolateConsumed = "🍫🍫🍫";
	let secretPlanRevealed = false;
	
	onMount(() => {
		setTimeout(() => secretPlanRevealed = true, 2000);
	});
</script>

<svelte:head>
	<title>Thank You Nadege! 🏔️</title>
</svelte:head>

<div class="container">
	<header>
		<h1>🎉 MERCI NADEGE! 🎉</h1>
		<p class="subtitle">Official Certificate of Awesome Hospitality</p>
	</header>

	<div class="thank-you-card">
		<div class="main-message">
			<h2>Dear Master of Secret Plans & Cat Whisperer,</h2>
			
			<p>
				This is to officially certify that <strong>Nadege</strong> has successfully:
			</p>
			
			<ul class="achievements">
				<li>✅ Provided mysterious accommodation with {secretPlanRevealed ? 'REVEALED' : 'SECRET'} location</li>
				<li>✅ Entrusted us with the sacred duty of keeping {catCount} cats alive</li>
				<li>✅ Offered mattresses, sheets, and "probably towels" (luxury!)</li>
				<li>✅ Provided free airport tickets knowledge (Swiss life hack!)</li>
				<li>✅ Promised to discover her brother's place... with us 😂</li>
			</ul>

			<div class="highlight-box">
				<h3>🏆 Achievement Unlocked: Ultimate Host</h3>
				<p>
					Successfully convinced two slightly lost friends to fly to Geneva 
					for a weekend of cat-sitting and Swiss adventures!
				</p>
			</div>

			<div class="chat-memories">
				<div class="chat-bubble">
					<strong>Kirill:</strong> "oh secret plan 😏"<br>
					<strong>Nadege:</strong> "Be careful" 
					<span class="comment">← Still don't know what this means... 🤔</span>
				</div>
				<div class="chat-bubble">
					<strong>Nadege:</strong> "Our goal is to keep the two cats alive"<br>
					<span class="comment">← No pressure AT ALL 🐱💀</span>
				</div>
			</div>

			<div class="gratitude-section">
				<h3>💝 Seriously Though...</h3>
				<p>
					Thank you for opening your (brother's) home to us, sharing your beautiful city, 
					and trusting us with feline lives. You're the kind of friend who makes 
					spontaneous adventures possible and life infinitely more fun!
				</p>
				
				<p>
					We promise to:
				</p>
				<ul class="promises">
					<li>Keep the cats very much alive ✨</li>
					<li>Not break anything (probably)</li>
					<li>Share our Swiss chocolate discoveries 🍫</li>
					<li>Match your mysterious planning energy 🕵️‍♀️</li>
				</ul>
			</div>

			<div class="footer-message">
				<p class="signature">
					With infinite gratitude and slightly nervous excitement,<br>
					<strong>Kirill 🍀 & Emery 💯</strong>
				</p>
				<p class="ps">
					P.S. - Still recovering from being sick during holidays. 
					Your healing Swiss mountain air better work! 🏔️✨
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		padding: 0;
	}

	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
		line-height: 1.7;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
		min-height: 100vh;
		color: #2d3748;
		position: relative;
		overflow-x: hidden;
	}

	.container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%),
					radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3), transparent 50%),
					radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2), transparent 50%);
		pointer-events: none;
		z-index: 0;
	}

	.container > * {
		position: relative;
		z-index: 1;
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
		color: white;
		padding: 2rem 0;
	}

	h1 {
		font-size: clamp(2.5rem, 5vw, 4rem);
		margin: 0;
		font-weight: 800;
		letter-spacing: -0.02em;
		text-shadow: 0 4px 12px rgba(0,0,0,0.3);
		animation: float 3s ease-in-out infinite;
		background: linear-gradient(45deg, #ffffff, #f7fafc, #ffffff);
		background-size: 200% 200%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: float 3s ease-in-out infinite, shimmer 2s ease-in-out infinite alternate;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-8px); }
	}

	@keyframes shimmer {
		0% { background-position: 0% 50%; }
		100% { background-position: 100% 50%; }
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideInLeft {
		from {
			opacity: 0;
			transform: translateX(-30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.subtitle {
		font-style: italic;
		font-size: clamp(1rem, 2.5vw, 1.3rem);
		margin-top: 1rem;
		opacity: 0.95;
		font-weight: 300;
		letter-spacing: 0.5px;
		text-shadow: 0 2px 8px rgba(0,0,0,0.2);
	}

	.thank-you-card {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 24px;
		box-shadow: 0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.2);
		animation: fadeInUp 0.8s ease-out;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.thank-you-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 35px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1);
	}

	.main-message {
		padding: clamp(2rem, 5vw, 4rem);
	}

	h2 {
		color: #553c9a;
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 700;
		padding-bottom: 1rem;
		margin-bottom: 2rem;
		position: relative;
		letter-spacing: -0.01em;
	}

	h2::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 60px;
		height: 4px;
		background: linear-gradient(90deg, #ed8936, #f6ad55);
		border-radius: 2px;
		animation: slideInLeft 0.8s ease-out 0.3s both;
	}

	.achievements {
		background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
		padding: 2rem;
		border-radius: 16px;
		border: none;
		margin: 2rem 0;
		box-shadow: 0 8px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6);
		position: relative;
		overflow: hidden;
	}

	.achievements::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 6px;
		background: linear-gradient(180deg, #48bb78, #68d391);
		border-radius: 0 3px 3px 0;
	}

	.achievements li {
		margin: 1rem 0;
		font-weight: 500;
		padding: 0.5rem 0;
		transition: transform 0.2s ease;
		border-radius: 8px;
		padding-left: 0.5rem;
		list-style: none;
	}

	.achievements li:hover {
		transform: translateX(4px);
		background: rgba(255, 255, 255, 0.3);
	}

	.highlight-box {
		background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #fbbf24 100%);
		padding: 2.5rem 2rem;
		border-radius: 20px;
		margin: 3rem 0;
		text-align: center;
		box-shadow: 0 15px 35px rgba(255, 215, 0, 0.25), 0 5px 15px rgba(0,0,0,0.08);
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.highlight-box::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
	}

	.highlight-box h3 {
		margin-top: 0;
		color: #744210;
		font-size: clamp(1.3rem, 2.5vw, 1.6rem);
		font-weight: 700;
		text-shadow: 0 1px 3px rgba(0,0,0,0.1);
		margin-bottom: 1rem;
	}

	.chat-memories {
		background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
		padding: 2rem;
		border-radius: 18px;
		margin: 3rem 0;
		box-shadow: 0 10px 25px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6);
		border: 1px solid rgba(255, 255, 255, 0.4);
	}

	.chat-bubble {
		background: rgba(255, 255, 255, 0.9);
		padding: 1.5rem;
		margin: 1.5rem 0;
		border-radius: 20px;
		border: 1px solid rgba(226, 232, 240, 0.6);
		position: relative;
		box-shadow: 0 4px 15px rgba(0,0,0,0.04);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		backdrop-filter: blur(5px);
	}

	.chat-bubble:hover {
		transform: translateY(-1px);
		box-shadow: 0 8px 25px rgba(0,0,0,0.08);
	}

	.chat-bubble::before {
		content: '💬';
		position: absolute;
		left: -10px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1.5rem;
		background: linear-gradient(135deg, #667eea, #764ba2);
		width: 35px;
		height: 35px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0,0,0,0.15);
	}

	.comment {
		color: #718096;
		font-style: italic;
		font-size: 0.9rem;
		margin-top: 0.5rem;
		padding-left: 1rem;
		border-left: 3px solid #e2e8f0;
		background: rgba(113, 128, 150, 0.05);
		padding: 0.75rem 1rem;
		border-radius: 0 8px 8px 0;
	}

	.gratitude-section {
		background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
		padding: 2.5rem;
		border-radius: 20px;
		margin: 3rem 0;
		box-shadow: 0 15px 35px rgba(102, 126, 234, 0.1), inset 0 1px 0 rgba(255,255,255,0.6);
		border: 1px solid rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(5px);
	}

	.promises {
		background: rgba(255, 255, 255, 0.9);
		padding: 1.5rem;
		border-radius: 12px;
		border: none;
		box-shadow: 0 8px 20px rgba(0,0,0,0.06);
		position: relative;
		overflow: hidden;
	}

	.promises::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 5px;
		background: linear-gradient(180deg, #ed8936, #f6ad55);
	}

	.promises li {
		margin: 0.75rem 0;
		transition: transform 0.2s ease;
		padding: 0.25rem 0;
		list-style: none;
	}

	.promises li:hover {
		transform: translateX(3px);
	}

	.footer-message {
		text-align: center;
		margin-top: 4rem;
		padding-top: 2.5rem;
		border-top: 2px solid rgba(226, 232, 240, 0.6);
		position: relative;
	}

	.footer-message::before {
		content: '';
		position: absolute;
		top: -1px;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 2px;
		background: linear-gradient(90deg, #667eea, #764ba2);
		border-radius: 1px;
	}

	.signature {
		font-size: clamp(1.1rem, 2vw, 1.3rem);
		font-weight: 700;
		color: #553c9a;
		line-height: 1.4;
		margin: 1rem 0;
	}

	.ps {
		font-style: italic;
		color: #718096;
		margin-top: 1.5rem;
		font-size: 0.95rem;
		padding: 1rem;
		background: rgba(113, 128, 150, 0.05);
		border-radius: 12px;
		border: 1px solid rgba(113, 128, 150, 0.1);
	}

	h3 {
		color: #2d3748;
		margin-top: 2rem;
		font-size: clamp(1.2rem, 2.5vw, 1.4rem);
		font-weight: 600;
		line-height: 1.3;
	}

	/* Animation Classes */
	.achievements li {
		animation: slideInLeft 0.6s ease-out;
		animation-fill-mode: both;
	}

	.achievements li:nth-child(1) { animation-delay: 0.1s; }
	.achievements li:nth-child(2) { animation-delay: 0.2s; }
	.achievements li:nth-child(3) { animation-delay: 0.3s; }
	.achievements li:nth-child(4) { animation-delay: 0.4s; }
	.achievements li:nth-child(5) { animation-delay: 0.5s; }

	.chat-bubble {
		animation: fadeInUp 0.8s ease-out;
		animation-fill-mode: both;
	}

	.chat-bubble:nth-of-type(1) { animation-delay: 0.2s; }
	.chat-bubble:nth-of-type(2) { animation-delay: 0.4s; }

	.promises li {
		animation: fadeInUp 0.5s ease-out;
		animation-fill-mode: both;
	}

	.promises li:nth-child(1) { animation-delay: 0.1s; }
	.promises li:nth-child(2) { animation-delay: 0.2s; }
	.promises li:nth-child(3) { animation-delay: 0.3s; }
	.promises li:nth-child(4) { animation-delay: 0.4s; }

	/* Smooth scrolling */
	html {
		scroll-behavior: smooth;
	}

	/* Loading states */
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	/* Enhanced Mobile Styles */
	@media (max-width: 768px) {
		.container {
			padding: 1rem 0.75rem;
		}
		
		.main-message {
			padding: 1.5rem;
		}
		
		header {
			padding: 1.5rem 0;
			margin-bottom: 2rem;
		}
		
		.achievements, .chat-memories, .gratitude-section {
			padding: 1.5rem;
			margin: 2rem 0;
		}
		
		.highlight-box {
			padding: 2rem 1.5rem;
			margin: 2rem 0;
		}
		
		.chat-bubble {
			padding: 1.25rem;
			margin: 1.25rem 0;
		}
		
		.chat-bubble::before {
			left: -8px;
			width: 30px;
			height: 30px;
			font-size: 1.2rem;
		}
		
		.footer-message {
			margin-top: 3rem;
			padding-top: 2rem;
		}
	}
	
	@media (max-width: 480px) {
		.container {
			padding: 0.75rem 0.5rem;
		}
		
		.main-message {
			padding: 1.25rem;
		}
		
		.achievements, .chat-memories, .gratitude-section {
			padding: 1.25rem;
		}
		
		.highlight-box {
			padding: 1.5rem 1.25rem;
		}
		
		.chat-bubble::before {
			display: none;
		}
	}
</style>