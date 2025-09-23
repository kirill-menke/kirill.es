<script>
	import { onMount } from 'svelte';
	
	let yearsAtFujitsu = 0;
	let coffeesCounted = 47;
	let projectsLaunched = 0;
	let techStackMastered = false;
	
	onMount(() => {
		setTimeout(() => techStackMastered = true, 2000);
		const interval = setInterval(() => {
			if (yearsAtFujitsu < 1) yearsAtFujitsu += 0.1;
		}, 100);
		
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Felix @ Fujitsu 🚀</title>
</svelte:head>

<div class="container">
	<header>
		<h1>🎉 FELIX JOINS FUJITSU! 🎉</h1>
		<p class="subtitle">Official Welcome to the Corporate World</p>
	</header>

	<div class="welcome-card">
		<div class="main-message">
			<h2>Dear Code Wizard & Future Tech Leader,</h2>
			
			<p>
				This is to officially celebrate that <strong>Felix</strong> has successfully:
			</p>
			
			<ul class="achievements">
				<li>✅ Landed a position at {techStackMastered ? 'THE LEGENDARY' : 'THE AMAZING'} Fujitsu</li>
				<li>✅ Traded student life for corporate coffee ({coffeesCounted} cups and counting)</li>
				<li>✅ Acquired official business email ending in @fujitsu.com</li>
				<li>✅ Mastered the art of looking busy in meetings 📊</li>
				<li>✅ Ready to revolutionize enterprise technology ⚡</li>
			</ul>

			<div class="highlight-box">
				<h3>🏆 Achievement Unlocked: Corporate Developer</h3>
				<p>
					Successfully transitioned from coding for fun to coding for profit!
					Watch out world, Felix is bringing fresh ideas to enterprise tech.
				</p>
			</div>

			<div class="fujitsu-facts">
				<div class="fact-bubble">
					<strong>Fun Fact:</strong> Fujitsu has been around since 1935<br>
					<span class="comment">← That's like... ancient in tech years! 👴💻</span>
				</div>
				<div class="fact-bubble">
					<strong>Mission:</strong> "Make the world more sustainable by building trust in society"<br>
					<span class="comment">← No pressure to save the world or anything 🌍✨</span>
				</div>
			</div>

			<div class="career-section">
				<h3>💼 The Corporate Adventure Begins...</h3>
				<p>
					Welcome to the world of enterprise solutions, endless meetings, and the eternal 
					quest for work-life balance! You're going to crush it at Fujitsu and probably 
					become the coolest person in every stand-up meeting.
				</p>
				
				<p>
					We predict you'll:
				</p>
				<ul class="predictions">
					<li>Revolutionize at least 3 legacy systems ⚡</li>
					<li>Become the go-to person for "impossible" problems 🧩</li>
					<li>Master the corporate buzzword bingo 📝</li>
					<li>Still find time to code awesome side projects 🌙</li>
				</ul>
			</div>

			<div class="tech-stats">
				<h3>📊 Felix's Tech Journey Stats</h3>
				<div class="stats-grid">
					<div class="stat-card">
						<div class="stat-number">{yearsAtFujitsu.toFixed(1)}</div>
						<div class="stat-label">Years at Fujitsu</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">{coffeesCounted}</div>
						<div class="stat-label">Coffees Consumed</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">{projectsLaunched}</div>
						<div class="stat-label">Projects Launched</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">∞</div>
						<div class="stat-label">Lines of Code</div>
					</div>
				</div>
			</div>

			<div class="footer-message">
				<p class="signature">
					Congratulations and best of luck!<br>
					<strong>From your coding family 🍀</strong>
				</p>
				<p class="ps">
					P.S. - Don't forget us when you become CTO! 🚀😉
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
		background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
		min-height: 100vh;
		color: #1e293b;
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
		background: radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3), transparent 50%),
					radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.3), transparent 50%),
					radial-gradient(circle at 40% 40%, rgba(30, 58, 138, 0.2), transparent 50%);
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
		background: linear-gradient(45deg, #ffffff, #f1f5f9, #ffffff);
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

	.welcome-card {
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

	.welcome-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 35px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1);
	}

	.main-message {
		padding: clamp(2rem, 5vw, 4rem);
	}

	h2 {
		color: #1e40af;
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
		background: linear-gradient(90deg, #3b82f6, #06b6d4);
		border-radius: 2px;
		animation: slideInLeft 0.8s ease-out 0.3s both;
	}

	.achievements {
		background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
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
		background: linear-gradient(180deg, #3b82f6, #06b6d4);
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
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
		padding: 2.5rem 2rem;
		border-radius: 20px;
		margin: 3rem 0;
		text-align: center;
		box-shadow: 0 15px 35px rgba(59, 130, 246, 0.25), 0 5px 15px rgba(0,0,0,0.08);
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: white;
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
		color: #f8fafc;
		font-size: clamp(1.3rem, 2.5vw, 1.6rem);
		font-weight: 700;
		text-shadow: 0 1px 3px rgba(0,0,0,0.3);
		margin-bottom: 1rem;
	}

	.fujitsu-facts {
		background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
		padding: 2rem;
		border-radius: 18px;
		margin: 3rem 0;
		box-shadow: 0 10px 25px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6);
		border: 1px solid rgba(255, 255, 255, 0.4);
	}

	.fact-bubble {
		background: rgba(255, 255, 255, 0.9);
		padding: 1.5rem;
		margin: 1.5rem 0;
		border-radius: 20px;
		border: 1px solid rgba(203, 213, 225, 0.6);
		position: relative;
		box-shadow: 0 4px 15px rgba(0,0,0,0.04);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		backdrop-filter: blur(5px);
	}

	.fact-bubble:hover {
		transform: translateY(-1px);
		box-shadow: 0 8px 25px rgba(0,0,0,0.08);
	}

	.fact-bubble::before {
		content: '🏢';
		position: absolute;
		left: -10px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1.5rem;
		background: linear-gradient(135deg, #1e40af, #3b82f6);
		width: 35px;
		height: 35px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0,0,0,0.15);
	}

	.comment {
		color: #64748b;
		font-style: italic;
		font-size: 0.9rem;
		margin-top: 0.5rem;
		padding-left: 1rem;
		border-left: 3px solid #e2e8f0;
		background: rgba(100, 116, 139, 0.05);
		padding: 0.75rem 1rem;
		border-radius: 0 8px 8px 0;
	}

	.career-section {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(30, 64, 175, 0.15));
		padding: 2.5rem;
		border-radius: 20px;
		margin: 3rem 0;
		box-shadow: 0 15px 35px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255,255,255,0.6);
		border: 1px solid rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(5px);
	}

	.predictions {
		background: rgba(255, 255, 255, 0.9);
		padding: 1.5rem;
		border-radius: 12px;
		border: none;
		box-shadow: 0 8px 20px rgba(0,0,0,0.06);
		position: relative;
		overflow: hidden;
	}

	.predictions::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 5px;
		background: linear-gradient(180deg, #3b82f6, #06b6d4);
	}

	.predictions li {
		margin: 0.75rem 0;
		transition: transform 0.2s ease;
		padding: 0.25rem 0;
		list-style: none;
	}

	.predictions li:hover {
		transform: translateX(3px);
	}

	.tech-stats {
		background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
		color: white;
		padding: 2.5rem;
		border-radius: 20px;
		margin: 3rem 0;
		box-shadow: 0 15px 35px rgba(15, 23, 42, 0.3);
	}

	.tech-stats h3 {
		color: #06b6d4;
		text-align: center;
		margin-bottom: 2rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.stat-card {
		background: rgba(59, 130, 246, 0.1);
		padding: 1.5rem;
		border-radius: 16px;
		text-align: center;
		border: 1px solid rgba(59, 130, 246, 0.2);
		backdrop-filter: blur(10px);
		transition: transform 0.3s ease;
	}

	.stat-card:hover {
		transform: translateY(-5px);
		background: rgba(59, 130, 246, 0.15);
	}

	.stat-number {
		font-size: 2.5rem;
		font-weight: bold;
		color: #06b6d4;
		margin-bottom: 0.5rem;
		animation: countUp 2s ease-out;
	}

	@keyframes countUp {
		from { opacity: 0; transform: scale(0.5); }
		to { opacity: 1; transform: scale(1); }
	}

	.stat-label {
		font-size: 0.9rem;
		color: #94a3b8;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-weight: 500;
	}

	.footer-message {
		text-align: center;
		margin-top: 4rem;
		padding-top: 2.5rem;
		border-top: 2px solid rgba(203, 213, 225, 0.6);
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
		background: linear-gradient(90deg, #3b82f6, #06b6d4);
		border-radius: 1px;
	}

	.signature {
		font-size: clamp(1.1rem, 2vw, 1.3rem);
		font-weight: 700;
		color: #1e40af;
		line-height: 1.4;
		margin: 1rem 0;
	}

	.ps {
		font-style: italic;
		color: #64748b;
		margin-top: 1.5rem;
		font-size: 0.95rem;
		padding: 1rem;
		background: rgba(100, 116, 139, 0.05);
		border-radius: 12px;
		border: 1px solid rgba(100, 116, 139, 0.1);
	}

	h3 {
		color: #1e293b;
		margin-top: 2rem;
		font-size: clamp(1.2rem, 2.5vw, 1.4rem);
		font-weight: 600;
		line-height: 1.3;
	}

	.achievements li {
		animation: slideInLeft 0.6s ease-out;
		animation-fill-mode: both;
	}

	.achievements li:nth-child(1) { animation-delay: 0.1s; }
	.achievements li:nth-child(2) { animation-delay: 0.2s; }
	.achievements li:nth-child(3) { animation-delay: 0.3s; }
	.achievements li:nth-child(4) { animation-delay: 0.4s; }
	.achievements li:nth-child(5) { animation-delay: 0.5s; }

	.fact-bubble {
		animation: fadeInUp 0.8s ease-out;
		animation-fill-mode: both;
	}

	.fact-bubble:nth-of-type(1) { animation-delay: 0.2s; }
	.fact-bubble:nth-of-type(2) { animation-delay: 0.4s; }

	.predictions li {
		animation: fadeInUp 0.5s ease-out;
		animation-fill-mode: both;
	}

	.predictions li:nth-child(1) { animation-delay: 0.1s; }
	.predictions li:nth-child(2) { animation-delay: 0.2s; }
	.predictions li:nth-child(3) { animation-delay: 0.3s; }
	.predictions li:nth-child(4) { animation-delay: 0.4s; }

	html {
		scroll-behavior: smooth;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

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
		
		.achievements, .fujitsu-facts, .career-section, .tech-stats {
			padding: 1.5rem;
			margin: 2rem 0;
		}
		
		.highlight-box {
			padding: 2rem 1.5rem;
			margin: 2rem 0;
		}
		
		.fact-bubble {
			padding: 1.25rem;
			margin: 1.25rem 0;
		}
		
		.fact-bubble::before {
			left: -8px;
			width: 30px;
			height: 30px;
			font-size: 1.2rem;
		}
		
		.footer-message {
			margin-top: 3rem;
			padding-top: 2rem;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}
	}
	
	@media (max-width: 480px) {
		.container {
			padding: 0.75rem 0.5rem;
		}
		
		.main-message {
			padding: 1.25rem;
		}
		
		.achievements, .fujitsu-facts, .career-section, .tech-stats {
			padding: 1.25rem;
		}
		
		.highlight-box {
			padding: 1.5rem 1.25rem;
		}
		
		.fact-bubble::before {
			display: none;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>