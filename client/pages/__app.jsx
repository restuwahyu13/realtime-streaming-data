import App from 'next/app'

class NextApp extends App {
	static async getInitialProps(appContext) {
		const { Component, ctx } = appContext

		let pageProps = {}
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx)
		}
		return { pageProps }
	}

	render() {
		const { Component, pageProps } = this.props

		return <Component {...pageProps} />
	}
}

export default NextApp
