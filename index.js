import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import os from 'os';
import fetch from 'node-fetch';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { setWallpaper } from 'wallpaper';

config();

let currentID, randomPhoto;

const imagePath = path.resolve(
	os.homedir(),
	'Pictures/wallpapers/wallpaper.jpg'
);
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function changeWallpaper() {
	// const searchTerms = ['desktop_wallpapers', 'space', 'flowers'];
	const searchTerms = ['tokyo', 'cities', 'galaxy'];
	const apiUrl = `https://api.unsplash.com/search/photos?query=${random(
		searchTerms
	)}&page=${Math.floor(Math.random() * 250)}&orientation=landscape`;
	const accessKey = process.env.ACCESS_KEY;
	const data = await fetch(apiUrl, {
		headers: {
			Authorization: `Client-ID ${accessKey}`,
		},
	})
		.then((res) => res.json())
		.then((d) => d);
	do {
		randomPhoto = random(data.results);
	} while (currentID === randomPhoto.id);
	currentID = randomPhoto.id;
	const imageUrl = randomPhoto.urls.full;

	const imageResponse = await fetch(imageUrl);
	const streamPipeline = promisify(pipeline);

	await streamPipeline(imageResponse.body, fs.createWriteStream(imagePath));
	console.log('Image downloaded and saved successfully.');
	await setWallpaper(imagePath);
	console.log('Wallpaper updated successfully');
}

(async () => {
	await changeWallpaper();
	setInterval(async () => await changeWallpaper(), 300000);
})();
