import { config } from 'dotenv';
import { Service } from 'node-windows';
import { resolve } from 'path';
config();
const serviceName = 'wallpaperService';

const svc = new Service({
	name: serviceName,
	description:
		'A simple wallpaper service built with Node.JS using the Unsplash API',
	script: resolve('index.js'),
});
svc.logOnAs.account = process.env.USERNAME;
svc.logOnAs.password = process.env.PASSWORD;

svc.on('install', function () {
	svc.start();
	console.log(`${serviceName} installed and started successfylly`);
});

svc.on('uninstall', () => {
	console.log(`${serviceName} has been successuflly removed.`);
});

const { argv } = process;

if (argv.includes('-u')) {
	svc.uninstall();
} else svc.install();
