import React from 'react';
import outerImageSrc from './scratch-top-image.jpg';
import brush from './brush.png';
import voucher from './voucher.jpeg';
import './index.css';

class ScratchImage extends React.PureComponent {
	constructor(props) {
		super(props);
		this.isDrawing = false;
		this.lastPoint = null;
		this.displayConfirm = false;
		this.touchStart = this.touchStart.bind(this);
		this.touchMove = this.touchMove.bind(this);
		this.touchEnd = this.touchEnd.bind(this);
		this.getFilledInPixels = this.getFilledInPixels.bind(this);
		this.handlePercentage = this.handlePercentage.bind(this);
		this.reset = this.reset.bind(this);
		this.doneScratch = this.doneScratch.bind(this);
	}

	componentDidMount() {
		this.setState({ displayConfirm: false });
		const canvas = this.canvas;
		canvas.width = canvas.parentElement.offsetWidth;
		canvas.height = canvas.parentElement.offsetHeight;

		canvas.addEventListener('mousedown', this.touchStart);
		canvas.addEventListener('touchstart', this.touchStart);
		canvas.addEventListener('mousemove', this.touchMove);
		canvas.addEventListener('touchmove', this.touchMove);
		canvas.addEventListener('mouseup', this.touchEnd);
		canvas.addEventListener('touchend', this.touchEnd);

		this.ctx = canvas.getContext('2d');

		this.brush = new Image();
		if (this.props.brush) {
			this.brush.src = this.props.brush;
		} else {
			this.brush.src = brush;
		}

		this.cover = new Image();

		if (this.props.outerImageSrc) {
			this.cover.src = this.props.outerImageSrc;
		} else {
			this.cover.src = outerImageSrc;
		}

		this.cover.onload = () =>
			this.ctx.drawImage(this.cover, 0, 0, canvas.width, canvas.height);
	}

	componentWillUnmount() {
		const canvas = this.canvas;
		canvas.removeEventListener('mousedown', this.touchStart);
		canvas.removeEventListener('touchstart', this.touchStart);
		canvas.removeEventListener('mousemove', this.touchMove);
		canvas.removeEventListener('touchmove', this.touchMove);
		canvas.removeEventListener('mouseup', this.touchEnd);
		canvas.removeEventListener('touchend', this.touchEnd);
	}

	getPosition(event) {
		let target = this.canvas;
		let offsetX = 0;
		let offsetY = 0;

		if (target.offsetParent !== undefined) {
			while ((target = target.offsetParent)) {
				offsetX += target.offsetLeft;
				offsetY += target.offsetTop;
			}
		}

		const x = (event.pageX || event.touches[0].clientX) - offsetX;
		const y = (event.pageY || event.touches[0].clientY) - offsetY;

		return { x, y };
	}

	touchStart(event) {
		if (window.innerHeight < 600) {
			window.scrollTo({ top: 50, behavior: 'smooth' });
		} else if (window.innerHeight < 700) {
			window.scrollTo({ top: 30, behavior: 'smooth' });
		} else if (window.innerHeight > 750) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}

		this.isDrawing = true;
		this.lastPoint = this.getPosition(event);

		this.ctx.globalCompositeOperation = 'destination-out';
	}

	touchMove(event) {
		if (!this.isDrawing) return;
		event.preventDefault();

		const ctx = this.ctx;
		const a = this.lastPoint;
		const b = this.getPosition(event);
		const dist = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
		const angle = Math.atan2(b.x - a.x, b.y - a.y);
		const offsetX = this.brush.width / 2;
		const offsetY = this.brush.height / 2;

		for (let x, y, i = 0; i < dist; i++) {
			x = a.x + Math.sin(angle) * i - offsetX;
			y = a.y + Math.cos(angle) * i - offsetY;
			ctx.drawImage(this.brush, x, y);
		}
		this.handlePercentage(this.getFilledInPixels(32));
		this.lastPoint = b;
	}

	touchEnd(event) {
		this.isDrawing = false;
	}

	// Only test every `stride` pixel. `stride`x faster,
	// but might lead to inaccuracy
	getFilledInPixels(stride) {
		if (!stride || stride < 1) {
			stride = 1;
		}

		var pixels = this.canvas
				.getContext('2d')
				.getImageData(0, 0, this.canvas.width, this.canvas.height),
			pdata = pixels.data,
			l = pdata.length,
			total = l / stride,
			count = 0;

		// Iterate over all pixels
		for (var i = (count = 0); i < l; i += stride) {
			if (parseInt(pdata[i]) === 0) {
				count++;
			}
		}

		return Math.round((count / total) * 100);
	}

	handlePercentage(filledInPixels) {
		filledInPixels = filledInPixels || 0;
		const percent = this.props.finishPercent;
		if (percent) {
			if (filledInPixels > percent) {
				this.setState({ displayConfirm: true });
			}
		} else {
			if (filledInPixels > 35) {
				this.setState({ displayConfirm: true });
			}
		}
	}

	reset() {
		const canvas = this.canvas;
		canvas.width = canvas.parentElement.offsetWidth;
		canvas.height = canvas.parentElement.offsetHeight;
		this.ctx = canvas.getContext('2d');
		this.cover = new Image();
		if (this.props.outerImageSrc) {
			this.cover.src = this.props.outerImageSrc;
		} else {
			this.cover.src = outerImageSrc;
		}
		this.cover.onload = () =>
			this.ctx.drawImage(this.cover, 0, 0, canvas.width, canvas.height);
	}

	doneScratch() {
		if (this.props.onComplete) {
			this.props.onComplete();
		}
	}

	render() {
		return (
			<div>
				<div className='images-wrapper'>
					<div
						className={
							this.props.outerImageWH ? this.props.outerImageWH : 'outer-image'
						}>
						<canvas ref={(el) => (this.canvas = el)} />
					</div>

					<div className={'inner-image'}>
						<img
							src={this.props.innerImage ? this.props.innerImage : voucher}
							alt='x'
							className={
								this.props.innerImageWH
									? this.props.innerImageWH
									: 'inner-image-wh'
							}
						/>
					</div>
				</div>
				<div style={{ marginTop: '1rem' }}>
					{this.state &&
					this.state.displayConfirm &&
					this.props.showResetText ? (
						<button className={this.props.resetBtn} onClick={this.reset}>
							{this.props.resetText ? this.props.resetText : 'Reset'}
						</button>
					) : null}
					{this.state &&
					this.state.displayConfirm &&
					this.props.showConfirmText ? (
						<button
							className={this.props.confirmBtn}
							style={{ marginLeft: '1rem' }}
							onClick={() => this.doneScratch}>
							{this.props.confirmText ? this.props.confirmText : 'Confirm'}
						</button>
					) : null}
				</div>
			</div>
		);
	}
}

export default ScratchImage;
