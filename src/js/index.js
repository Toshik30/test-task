import 'scss/style.scss';

console.log('module.hot', module.hot);
if (module.hot) {
	module.hot.accept('scss/style.scss', function() {
		console.log('Update styles');
	});
}