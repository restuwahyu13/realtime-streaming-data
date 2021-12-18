import { useState, useMemo } from 'react'
import { withRouter } from 'next/router'
import { io } from 'socket.io-client'

function RootPage(props) {
	const socket = io()
	socket.connect()

	const [value, setValue] = useState([])

	socket.emit(`client:send`, props.router.query.id)
	socket.on(`server:send:${props.router.query.id}`, (data) => {
		setValue(data)
	})

	const newValue = useMemo(() => {
		return value.length > 0 ? JSON.parse(value) : []
	}, [value])

	return (
		<div>
			<h1>Socket.io - Get All Driver Nearest</h1>
			<span>
				<strong>Drivers: </strong>
				{JSON.stringify(newValue)}
			</span>
		</div>
	)
}

export default withRouter(RootPage)
