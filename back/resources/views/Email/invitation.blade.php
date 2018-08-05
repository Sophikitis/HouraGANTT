<head>
	<style type="text/css">
		body {
			font-family: sans-serif;
			padding: 0;
			margin: 0;
		}
		h2 {
			color: #3396C4;
		}
		footer {
			background-image: url(http://localhost:4200/login-bg2.jpg);
			background-repeat: no-repeat;
			background-attachment: local;
			background-position: center bottom;
			background-size: 100% auto;
			height: 30%;
			margin-top: 7%;
		}
		footer div {
			color: white;
			padding: 3% 3% 3% 41%;
		}
		div.content {
			width: 50%;
			margin: 0 auto;
		}
		div.identifier-info {
			padding: 10%;
			width: 80%;
		}
		div.card {
			padding: 21px;
			box-shadow: 1px 3px 23px -6px grey;
		}
		.strong {
			color: #3396C4;
			font-weight: bold;
		}
		p.builts-icon {
			padding: 9%;
		}
		p.builts-text {
			color: white;
			padding: 9%;
		}
		div.builts {
			padding: 2% 10%;
			width: 80%;
		}
		div.inside-os {
			width: 30%;
			padding: 0 7px;
		}
		div.inside-os a {
			text-decoration: none;
		}
		div.text-side {
			background-color: #3396C4;
		}
		.header-img {
			background-image: url(http://localhost:4200/login-bg2.jpg);
			background-repeat: no-repeat;
			background-attachment: local; 
			background-position: 0% 80%;
			background-size: 100% auto;
			padding: 5% 5% 15% 5%;
		}
		.header-img img {
			width: 30%;
			margin: 0 auto;
		}
		.flex {
			display: flex;
			flex-wrap: nowrap;
			justify-content: space-between; 
		}
	</style>
</head>
<body>
	<div class="header-img">
		<div class="flex flex-vertical">
			<img src="http://localhost:4200/assets/img/logo-hourgantt.png">
		</div>
	</div>
	<div class="identifier-info">
		<h2>Someone invites you to join {{ $project->name }} !</h2>
		<div class="card">
			<p>Find your credentials below :</p>
			<p><span class="strong">Your username </span>: {{ $project->temp_username }}</p>
			<p><span class="strong">Your temporary password </span>: {{ $project->temp_password }} </p>
		</div>
	</div>

	<div class="builts flex">
		<div class="inside-os flex">
			<a href="https://github.com/lucyjosef/HouraGANTT" target="_blank">
			<div class="icon-side">
					<p class="builts-icon"><img src="https://imageog.flaticon.com/icons/png/512/23/23700.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF" height="50px"></i></p>
				</div>
				<div class="text-side">
					<p class="builts-text">Download<br>for Windows</p>
				</div>
			</a>
		</div>
		<div class="inside-os flex">
			<a href="https://github.com/lucyjosef/HouraGANTT" target="_blank">
				<div class="icon-side">
					<p class="builts-icon"><img src="https://image.freepik.com/icones-gratuites/linux-logo_318-42235.jpg" height="55px"></p>
				</div>
				<div class="text-side">
					<p class="builts-text">Download<br>for Linux</p>
				</div>
			</a>
		</div>
		<div class="inside-os flex">
			<a href="https://github.com/lucyjosef/HouraGANTT" target="_blank">
				<div class="icon-side">
					<p class="builts-icon"><img src="https://imageog.flaticon.com/icons/png/512/23/23656.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF" height="50px"></i></p>
				</div>
				<div class="text-side">
					<p class="builts-text">Download<br>for Macintosh</p>
				</div>
			</a>
		</div>
	</div>

	<footer>
		<div>
			<p>See you soon !<br>
			Team HouraGANTT</p>
		</div>
	</footer>
</body>
