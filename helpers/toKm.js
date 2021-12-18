exports.toKiloMeter = (lat1, lon1, lat2, lon2) => {
	let radiusCordinate = 6371
	let latitude = (lat2 - lat1) * (Math.PI / 180)
	let logitude = (lon2 - lon1) * (Math.PI / 180)

	let x1 = Math.sin(latitude / 2) * Math.sin(latitude / 2)
	let x2 = Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(logitude / 2) * Math.sin(logitude / 2)
	let x3 = x1 + x2

	let calculated = 2 * Math.atan2(Math.sqrt(x3), Math.sqrt(1 - x3))
	return Math.round(radiusCordinate * calculated)
}
