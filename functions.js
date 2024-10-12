/**
 * Secret Santa
 * 
 * This script will assign secret santa partners to a list of names.
 */
const people = [
	"Anette",
	"Richard",
	"Laura",
	"Jakob",
	"Nina",
	"Philipp",
	// "Sarah",
	// "Samuel",
	"Ralph",
	"Anett",
	"Paula",
	// "Ben",
	// "Malou",
	"Christine",
	"Helmut S.",
	"Florian",
	"Hilga",
	"Helmut G.",
	"Jürgen",
	"Soo"
];


const exceptions = {
	"Anette": [
		"Jürgen",
		"Anett",
		"Laura",
		"Paula"
	],
	"Richard": [
		"Helmut G.",
		"Hilga",
		"Laura",
		"Samuel"
	],
	"Laura": [
		"Anette",
		"Nina",
		"Richard"
	],
	"Jakob": [
		"Philipp",
		"Hilga",
		"Anette",
		"Samuel"
	],
	"Nina": [
		"Philipp",
		"Christine",
		"Sarah",
		"Richard"
	],
	"Philipp": [
		"Jürgen",
		"Nina",
		"Sarah"
	],
	"Ralph": [
		"Helmut S.",
		"Philipp",
		"Florian"
	],
	"Anett": [
		"Ralph",
		"Jakob",
		"Nina"
	],
	"Paula": [
		"Jakob",
		"Hilga"
	],
	"Christine": [
		"Jakob",
		"Paula",
		"Sarah"
	],
	"Helmut S.": [
		"Laura",
		"Christine",
		"Sarah"
	],
	"Florian": [
		"Helmut G.",
		"Ralph",
		"Samuel"
	],
	"Hilga": [
		"Richard",
		"Anett",
		"Christine"
	],
	"Helmut G.": [
		"Jürgen",
		"Helmut S.",
		"Nina",
		"Anett"
	],
	"Jürgen": [
		"Ralph",
		"Florian",
		"Laura"
	],
	"Soo": [
		"Florian"
	]
};


/**
 * ========================================
 * 
 * Logic
 * 
 * ========================================
 */


/**
 * Assign names to other names.
 */
function assignNames( names ) {
	const shuffledNames = [ ...names ]; // Create a copy of the input array
	for ( let i = shuffledNames.length - 1; i > 0; i-- ) {
		// Shuffle the array using the Fisher-Yates algorithm
		const j = Math.floor( Math.random() * ( i + 1 ) );
		[ shuffledNames[ i ], shuffledNames[ j ] ] = [ shuffledNames[ j ], shuffledNames[ i ] ];
	}

	const assignments = {};
	for ( let i = 0; i < names.length; i++ ) {
		const person = names[ i ];
		const assignedPerson = shuffledNames[ i ];
		assignments[ person ] = assignedPerson;
	}

	return assignments;
}

/**
 * Check if a key & value pair matches, retry if it is
 */
function checkAssignments( assignments ) {

	for ( let person in assignments ) {

		const assignedPerson = assignments[ person ];

		// return FALSE: if 2 people are assigned to each the same person
		if ( Object.values( assignments ).filter( name => name === assignedPerson ).length > 1 ) {
			console.error( "2 people are assigned to the same person:", assignments );
			return false;
		}

		// return FALSE: if a person is assigned to themselves
		if ( person === assignedPerson ) {
			// console.error( person + " is assigned to themselves:", assignments );
			return false;
		}

		// return FALSE: a person is assigned to an exception
		if ( exceptions[ person ] && exceptions[ person ].includes( assignedPerson ) ) {
			// console.error( person + " is assigned to an exception:", assignments );
			return false;
		}
	}
	return true;
}


/**
 * ========================================
 * 
 * Encryption & Decryption
 * 
 * ========================================
 */

// Function to generate random padding characters
function generateRandomPadding( length ) {
	const paddingChars = "!@#$%^&*()_+[]{}|;':,.<>?";
	let padding = '';
	for ( let i = 0; i < length; i++ ) {
		const randomIndex = Math.floor( Math.random() * paddingChars.length );
		padding += paddingChars.charAt( randomIndex );
	}
	return padding;
}

// Function to base64 encode text with random padding
function base64Encode( text ) {
	const encodedText = btoa( text );
	const padding = generateRandomPadding( 4 ); // Choose the desired padding length
	return encodedText + padding;
}

// Function to base64 decode text with random padding
function base64Decode( encodedText ) {
	const padding = encodedText.slice( -4 ); // Remove the last 4 characters as padding
	const trimmedEncodedText = encodedText.slice( 0, -4 );
	return atob( trimmedEncodedText );
}

// Simple encryption and decryption functions
function encrypt( text, key ) {
	let encryptedText = '';
	for ( let i = 0; i < text.length; i++ ) {
		const charCode = text.charCodeAt( i ) ^ key.charCodeAt( i % key.length );
		encryptedText += String.fromCharCode( charCode );
	}
	return encryptedText;
}

function decrypt( encryptedText, key ) {
	return encrypt( encryptedText, key ); // XOR encryption is reversible
}

// Generate a random encryption key
// var globalKey = generateKey( 64 );
// alert( globalKey );

// Saved global keys
// var globalKey = 'viZ8yMNNEvtpudMtWIZUqRaN8pzU1yviw03mfUdgU9Tkwg59VPFdW5H7Mlfpn0Ov'; // test
var globalKey = 'XtSLdYpYqulWBUHmr30sRCnoIKPc6PjXur2cXM3TmkuQ094JM9dg1xuIlx3Ujug5'; // live

// Function to encrypt assignments and generate keys
function encryptAssignments( assignments ) {
	const encryptedAssignments = {};
	for ( const person in assignments ) {
		const assignedPerson = assignments[ person ];
		const encryptedName = encrypt( assignedPerson, globalKey );

		encryptedAssignments[ person ] = {
			name: assignedPerson,
			encrypted: base64Encode( encryptedName ),
			// encrypted: assignedPerson // test with clear names in the UI
		};
	}

	return encryptedAssignments;
}

// Function to generate a random unique key
function generateKey( length ) {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let key = "";
	for ( let i = 0; i < length; i++ ) {
		const randomIndex = Math.floor( Math.random() * charset.length );
		key += charset.charAt( randomIndex );
	}
	return key;
}


/**
 * ========================================
 * 
 * User Interface & Output
 * 
 * ========================================
 */

/**
 * Function to create a table and append it to a given div
 */
function createTable( divId, encryptedAssignments ) {
	const div = document.getElementById( divId );

	// Clear the contents of the div
	div.innerHTML = '';

	const table = document.createElement( 'table' );
	const tableHeader = document.createElement( 'thead' );
	const tableBody = document.createElement( 'tbody' );

	// Create table header row
	const headerRow = document.createElement( 'tr' );
	const headerCell1 = document.createElement( 'th' );
	headerCell1.textContent = 'Name';
	// const headerCell2 = document.createElement( 'th' );
	// headerCell2.textContent = 'Assigned To';
	const headerCell3 = document.createElement( 'th' );
	headerCell3.textContent = 'Encrypted Name';

	headerRow.appendChild( headerCell1 );
	// headerRow.appendChild( headerCell2 );
	headerRow.appendChild( headerCell3 );
	tableHeader.appendChild( headerRow );

	// Create table body rows
	for ( const person in encryptedAssignments ) {
		const assignment = encryptedAssignments[ person ];

		const row = document.createElement( 'tr' );
		const cell1 = document.createElement( 'td' );
		cell1.textContent = person;
		// const cell2 = document.createElement( 'td' );
		// cell2.textContent = assignment.name; // Display the assigned name
		const cell3 = document.createElement( 'td' );

		// Create a <code> element to wrap the encrypted name
		const codeElement = document.createElement( 'code' );
		codeElement.innerHTML = assignment.encrypted;
		cell3.appendChild( codeElement );

		row.appendChild( cell1 );
		// row.appendChild( cell2 );
		row.appendChild( cell3 );
		tableBody.appendChild( row );
	}

	table.appendChild( tableHeader );
	table.appendChild( tableBody );

	// Append the table to the div
	div.appendChild( table );
}

// Function to create input fields for decryption
function addDecryptionInputsActions() {
	// Add event listener to decrypt button
	const decryptButton = document.getElementById( 'decryptButton' );
	decryptButton.addEventListener( 'click', () => {
		const inputDecrypted = document.getElementById( 'inputEncrypted' ).value;

		if ( ! inputDecrypted ) {
			const decryptedNameDisplay = document.getElementById( 'decryptedName' );
			decryptedNameDisplay.innerHTML = `🚨 Fehler: Bitte gib einen verschlüsselten Namen ein 🚨`;
			return;
		}

		const inputEncrypted = base64Decode( inputDecrypted );
		const decryptedName  = decrypt( inputEncrypted, globalKey );
		const decryptedNameDisplay = document.getElementById( 'decryptedName' );
		decryptedNameDisplay.innerHTML = `Du hast dieses Jahr <strong>${ decryptedName }</strong> gezogen 🎁`;
	} );
}