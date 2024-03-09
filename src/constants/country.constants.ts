/**
 * User's country and language are stored as code to the backend.
 * These are needed to display country name and language name with code.
 */

interface CountryType {
	code: string;
	label: string;
}

interface LanguageType {
	code: string;
	name: string;
	countryCode: string;
}

// From https://gist.github.com/ssskip/5a94bfcd2835bf1dea52
export const countries: readonly CountryType[] = [
	{ code: 'AF', label: 'Afghanistan' },
	{ code: 'AX', label: 'Aland Islands' },
	{ code: 'AL', label: 'Albania' },
	{ code: 'DZ', label: 'Algeria' },
	{ code: 'AS', label: 'American Samoa' },
	{ code: 'AD', label: 'Andorra' },
	{ code: 'AO', label: 'Angola' },
	{ code: 'AI', label: 'Anguilla' },
	{ code: 'AQ', label: 'Antarctica' },
	{ code: 'AG', label: 'Antigua And Barbuda' },
	{ code: 'AR', label: 'Argentina' },
	{ code: 'AM', label: 'Armenia' },
	{ code: 'AW', label: 'Aruba' },
	{ code: 'AU', label: 'Australia' },
	{ code: 'AT', label: 'Austria' },
	{ code: 'AZ', label: 'Azerbaijan' },
	{ code: 'BS', label: 'Bahamas' },
	{ code: 'BH', label: 'Bahrain' },
	{ code: 'BD', label: 'Bangladesh' },
	{ code: 'BB', label: 'Barbados' },
	{ code: 'BY', label: 'Belarus' },
	{ code: 'BE', label: 'Belgium' },
	{ code: 'BZ', label: 'Belize' },
	{ code: 'BJ', label: 'Benin' },
	{ code: 'BM', label: 'Bermuda' },
	{ code: 'BT', label: 'Bhutan' },
	{ code: 'BO', label: 'Bolivia' },
	{ code: 'BA', label: 'Bosnia And Herzegovina' },
	{ code: 'BW', label: 'Botswana' },
	{ code: 'BV', label: 'Bouvet Island' },
	{ code: 'BR', label: 'Brazil' },
	{ code: 'IO', label: 'British Indian Ocean Territory' },
	{ code: 'BN', label: 'Brunei Darussalam' },
	{ code: 'BG', label: 'Bulgaria' },
	{ code: 'BF', label: 'Burkina Faso' },
	{ code: 'BI', label: 'Burundi' },
	{ code: 'KH', label: 'Cambodia' },
	{ code: 'CM', label: 'Cameroon' },
	{ code: 'CA', label: 'Canada' },
	{ code: 'CV', label: 'Cape Verde' },
	{ code: 'KY', label: 'Cayman Islands' },
	{ code: 'CF', label: 'Central African Republic' },
	{ code: 'TD', label: 'Chad' },
	{ code: 'CL', label: 'Chile' },
	{ code: 'CN', label: 'China' },
	{ code: 'CX', label: 'Christmas Island' },
	{ code: 'CC', label: 'Cocos (Keeling) Islands' },
	{ code: 'CO', label: 'Colombia' },
	{ code: 'KM', label: 'Comoros' },
	{ code: 'CG', label: 'Congo' },
	{ code: 'CD', label: 'Congo, Democratic Republic' },
	{ code: 'CK', label: 'Cook Islands' },
	{ code: 'CR', label: 'Costa Rica' },
	{ code: 'CI', label: "Cote D'Ivoire" },
	{ code: 'HR', label: 'Croatia' },
	{ code: 'CU', label: 'Cuba' },
	{ code: 'CY', label: 'Cyprus' },
	{ code: 'CZ', label: 'Czech Republic' },
	{ code: 'DK', label: 'Denmark' },
	{ code: 'DJ', label: 'Djibouti' },
	{ code: 'DM', label: 'Dominica' },
	{ code: 'DO', label: 'Dominican Republic' },
	{ code: 'EC', label: 'Ecuador' },
	{ code: 'EG', label: 'Egypt' },
	{ code: 'SV', label: 'El Salvador' },
	{ code: 'GQ', label: 'Equatorial Guinea' },
	{ code: 'ER', label: 'Eritrea' },
	{ code: 'EE', label: 'Estonia' },
	{ code: 'ET', label: 'Ethiopia' },
	{ code: 'FK', label: 'Falkland Islands (Malvinas)' },
	{ code: 'FO', label: 'Faroe Islands' },
	{ code: 'FJ', label: 'Fiji' },
	{ code: 'FI', label: 'Finland' },
	{ code: 'FR', label: 'France' },
	{ code: 'GF', label: 'French Guiana' },
	{ code: 'PF', label: 'French Polynesia' },
	{ code: 'TF', label: 'French Southern Territories' },
	{ code: 'GA', label: 'Gabon' },
	{ code: 'GM', label: 'Gambia' },
	{ code: 'GE', label: 'Georgia' },
	{ code: 'DE', label: 'Germany' },
	{ code: 'GH', label: 'Ghana' },
	{ code: 'GI', label: 'Gibraltar' },
	{ code: 'GR', label: 'Greece' },
	{ code: 'GL', label: 'Greenland' },
	{ code: 'GD', label: 'Grenada' },
	{ code: 'GP', label: 'Guadeloupe' },
	{ code: 'GU', label: 'Guam' },
	{ code: 'GT', label: 'Guatemala' },
	{ code: 'GG', label: 'Guernsey' },
	{ code: 'GN', label: 'Guinea' },
	{ code: 'GW', label: 'Guinea-Bissau' },
	{ code: 'GY', label: 'Guyana' },
	{ code: 'HT', label: 'Haiti' },
	{ code: 'HM', label: 'Heard Island & Mcdonald Islands' },
	{ code: 'VA', label: 'Holy See (Vatican City State)' },
	{ code: 'HN', label: 'Honduras' },
	{ code: 'HK', label: 'Hong Kong' },
	{ code: 'HU', label: 'Hungary' },
	{ code: 'IS', label: 'Iceland' },
	{ code: 'IN', label: 'India' },
	{ code: 'ID', label: 'Indonesia' },
	{ code: 'IR', label: 'Iran, Islamic Republic Of' },
	{ code: 'IQ', label: 'Iraq' },
	{ code: 'IE', label: 'Ireland' },
	{ code: 'IM', label: 'Isle Of Man' },
	{ code: 'IL', label: 'Israel' },
	{ code: 'IT', label: 'Italy' },
	{ code: 'JM', label: 'Jamaica' },
	{ code: 'JP', label: 'Japan' },
	{ code: 'JE', label: 'Jersey' },
	{ code: 'JO', label: 'Jordan' },
	{ code: 'KZ', label: 'Kazakhstan' },
	{ code: 'KE', label: 'Kenya' },
	{ code: 'KI', label: 'Kiribati' },
	{ code: 'KR', label: 'Korea' },
	{ code: 'KW', label: 'Kuwait' },
	{ code: 'KG', label: 'Kyrgyzstan' },
	{ code: 'LA', label: "Lao People's Democratic Republic" },
	{ code: 'LV', label: 'Latvia' },
	{ code: 'LB', label: 'Lebanon' },
	{ code: 'LS', label: 'Lesotho' },
	{ code: 'LR', label: 'Liberia' },
	{ code: 'LY', label: 'Libyan Arab Jamahiriya' },
	{ code: 'LI', label: 'Liechtenstein' },
	{ code: 'LT', label: 'Lithuania' },
	{ code: 'LU', label: 'Luxembourg' },
	{ code: 'MO', label: 'Macao' },
	{ code: 'MK', label: 'Macedonia' },
	{ code: 'MG', label: 'Madagascar' },
	{ code: 'MW', label: 'Malawi' },
	{ code: 'MY', label: 'Malaysia' },
	{ code: 'MV', label: 'Maldives' },
	{ code: 'ML', label: 'Mali' },
	{ code: 'MT', label: 'Malta' },
	{ code: 'MH', label: 'Marshall Islands' },
	{ code: 'MQ', label: 'Martinique' },
	{ code: 'MR', label: 'Mauritania' },
	{ code: 'MU', label: 'Mauritius' },
	{ code: 'YT', label: 'Mayotte' },
	{ code: 'MX', label: 'Mexico' },
	{ code: 'FM', label: 'Micronesia, Federated States Of' },
	{ code: 'MD', label: 'Moldova' },
	{ code: 'MC', label: 'Monaco' },
	{ code: 'MN', label: 'Mongolia' },
	{ code: 'ME', label: 'Montenegro' },
	{ code: 'MS', label: 'Montserrat' },
	{ code: 'MA', label: 'Morocco' },
	{ code: 'MZ', label: 'Mozambique' },
	{ code: 'MM', label: 'Myanmar' },
	{ code: 'NA', label: 'Namibia' },
	{ code: 'NR', label: 'Nauru' },
	{ code: 'NP', label: 'Nepal' },
	{ code: 'NL', label: 'Netherlands' },
	{ code: 'NC', label: 'New Caledonia' },
	{ code: 'NZ', label: 'New Zealand' },
	{ code: 'NI', label: 'Nicaragua' },
	{ code: 'NE', label: 'Niger' },
	{ code: 'NG', label: 'Nigeria' },
	{ code: 'NU', label: 'Niue' },
	{ code: 'NF', label: 'Norfolk Island' },
	{ code: 'MP', label: 'Northern Mariana Islands' },
	{ code: 'NO', label: 'Norway' },
	{ code: 'OM', label: 'Oman' },
	{ code: 'PK', label: 'Pakistan' },
	{ code: 'PW', label: 'Palau' },
	{ code: 'PS', label: 'Palestine, State of' },
	{ code: 'PA', label: 'Panama' },
	{ code: 'PG', label: 'Papua New Guinea' },
	{ code: 'PY', label: 'Paraguay' },
	{ code: 'PE', label: 'Peru' },
	{ code: 'PH', label: 'Philippines' },
	{ code: 'PN', label: 'Pitcairn' },
	{ code: 'PL', label: 'Poland' },
	{ code: 'PT', label: 'Portugal' },
	{ code: 'PR', label: 'Puerto Rico' },
	{ code: 'QA', label: 'Qatar' },
	{ code: 'RE', label: 'Reunion' },
	{ code: 'RO', label: 'Romania' },
	{ code: 'RU', label: 'Russian Federation' },
	{ code: 'RW', label: 'Rwanda' },
	{ code: 'BL', label: 'Saint Barthelemy' },
	{ code: 'SH', label: 'Saint Helena' },
	{ code: 'KN', label: 'Saint Kitts And Nevis' },
	{ code: 'LC', label: 'Saint Lucia' },
	{ code: 'MF', label: 'Saint Martin' },
	{ code: 'PM', label: 'Saint Pierre And Miquelon' },
	{ code: 'VC', label: 'Saint Vincent And Grenadines' },
	{ code: 'WS', label: 'Samoa' },
	{ code: 'SM', label: 'San Marino' },
	{ code: 'ST', label: 'Sao Tome And Principe' },
	{ code: 'SA', label: 'Saudi Arabia' },
	{ code: 'SN', label: 'Senegal' },
	{ code: 'RS', label: 'Serbia' },
	{ code: 'SC', label: 'Seychelles' },
	{ code: 'SL', label: 'Sierra Leone' },
	{ code: 'SG', label: 'Singapore' },
	{ code: 'SK', label: 'Slovakia' },
	{ code: 'SI', label: 'Slovenia' },
	{ code: 'SB', label: 'Solomon Islands' },
	{ code: 'SO', label: 'Somalia' },
	{ code: 'ZA', label: 'South Africa' },
	{ code: 'GS', label: 'South Georgia And Sandwich Isl.' },
	{ code: 'ES', label: 'Spain' },
	{ code: 'LK', label: 'Sri Lanka' },
	{ code: 'SD', label: 'Sudan' },
	{ code: 'SR', label: 'Suriname' },
	{ code: 'SJ', label: 'Svalbard And Jan Mayen' },
	{ code: 'SZ', label: 'Swaziland' },
	{ code: 'SE', label: 'Sweden' },
	{ code: 'CH', label: 'Switzerland' },
	{ code: 'SY', label: 'Syrian Arab Republic' },
	{ code: 'TW', label: 'Taiwan' },
	{ code: 'TJ', label: 'Tajikistan' },
	{ code: 'TZ', label: 'Tanzania' },
	{ code: 'TH', label: 'Thailand' },
	{ code: 'TL', label: 'Timor-Leste' },
	{ code: 'TG', label: 'Togo' },
	{ code: 'TK', label: 'Tokelau' },
	{ code: 'TO', label: 'Tonga' },
	{ code: 'TT', label: 'Trinidad And Tobago' },
	{ code: 'TN', label: 'Tunisia' },
	{ code: 'TR', label: 'Turkey' },
	{ code: 'TM', label: 'Turkmenistan' },
	{ code: 'TC', label: 'Turks And Caicos Islands' },
	{ code: 'TV', label: 'Tuvalu' },
	{ code: 'UG', label: 'Uganda' },
	{ code: 'UA', label: 'Ukraine' },
	{ code: 'AE', label: 'United Arab Emirates' },
	{ code: 'GB', label: 'United Kingdom' },
	{ code: 'US', label: 'United States' },
	{ code: 'UM', label: 'United States Outlying Islands' },
	{ code: 'UY', label: 'Uruguay' },
	{ code: 'UZ', label: 'Uzbekistan' },
	{ code: 'VU', label: 'Vanuatu' },
	{ code: 'VE', label: 'Venezuela' },
	{ code: 'VN', label: 'Vietnam' },
	{ code: 'VG', label: 'Virgin Islands, British' },
	{ code: 'VI', label: 'Virgin Islands, U.S.' },
	{ code: 'WF', label: 'Wallis And Futuna' },
	{ code: 'EH', label: 'Western Sahara' },
	{ code: 'YE', label: 'Yemen' },
	{ code: 'ZM', label: 'Zambia' },
	{ code: 'ZW', label: 'Zimbabwe' }
];

export const langs: readonly LanguageType[] = [
	{
		name: 'Afar',
		code: 'aa',
		countryCode: 'ER'
	},
	{
		name: 'Afrikaans',
		code: 'af',
		countryCode: 'ZA'
	},
	{
		name: 'Akan',
		code: 'ak',
		countryCode: 'GH'
	},
	{
		name: 'Akan, Twi',
		code: 'tw',
		countryCode: 'GH'
	},
	{
		name: 'Albanian',
		code: 'sq',
		countryCode: 'AL'
	},
	{
		name: 'Amharic',
		code: 'am',
		countryCode: 'ET'
	},
	{
		name: 'Arabic',
		code: 'ar',
		countryCode: 'JO'
	},
	{
		name: 'Aragonese',
		code: 'an',
		countryCode: 'ES'
	},
	{
		name: 'Armenian',
		code: 'hy',
		countryCode: 'AM'
	},
	{
		name: 'Assamese',
		code: 'as',
		countryCode: 'IN'
	},
	{
		name: 'Avestan',
		code: 'ae',
		countryCode: 'IR'
	},
	{
		name: 'Aymara',
		code: 'ay',
		countryCode: 'BO'
	},
	{
		name: 'Azerbaijani',
		code: 'az',
		countryCode: 'AZ'
	},
	{
		name: 'Bambara',
		code: 'bm',
		countryCode: 'ML'
	},
	{
		name: 'Basque',
		code: 'eu',
		countryCode: 'ES'
	},
	{
		name: 'Belarusian',
		code: 'be',
		countryCode: 'BY'
	},
	{
		name: 'Bengali',
		code: 'bn',
		countryCode: 'BN'
	},
	{
		name: 'Bihari',
		code: 'bh',
		countryCode: 'IN'
	},
	{
		name: 'Bislama',
		code: 'bi',
		countryCode: 'VU'
	},
	{
		name: 'Bosnian',
		code: 'bs',
		countryCode: 'BA'
	},
	{
		name: 'Breton',
		code: 'br',
		countryCode: 'FR'
	},
	{
		name: 'Bulgarian',
		code: 'bg',
		countryCode: 'BG'
	},
	{
		name: 'Burmese',
		code: 'my',
		countryCode: 'MM'
	},
	{
		name: 'Catalan',
		code: 'ca',
		countryCode: 'ES'
	},
	{
		name: 'Chamorro',
		code: 'ch',
		countryCode: 'GU'
	},
	{
		name: 'Chewa',
		code: 'ny',
		countryCode: 'MW'
	},
	{
		name: 'Chinese',
		code: 'zh',
		countryCode: 'CN'
	},
	{
		name: 'Cornish',
		code: 'kw',
		countryCode: 'GB'
	},
	{
		name: 'Corsican',
		code: 'co',
		countryCode: 'FR'
	},
	{
		name: 'Cree',
		code: 'cr',
		countryCode: 'CA'
	},
	{
		name: 'Croatian',
		code: 'hr',
		countryCode: 'HR'
	},
	{
		name: 'Czech',
		code: 'cs',
		countryCode: 'CZ'
	},
	{
		name: 'Danish',
		code: 'da',
		countryCode: 'DK'
	},
	{
		name: 'Dhivehi',
		code: 'dv',
		countryCode: 'MV'
	},
	{
		name: 'Dutch',
		code: 'nl',
		countryCode: 'NL'
	},
	{
		name: 'Dzongkha',
		code: 'dz',
		countryCode: 'BT'
	},
	{
		name: 'English',
		code: 'en',
		countryCode: 'US'
	},
	{
		name: 'English, United Kingdom',
		code: 'en-GB',
		countryCode: 'GB'
	},
	{
		name: 'Esperanto',
		code: 'eo',
		countryCode: 'UY'
	},
	{
		name: 'Estonian',
		code: 'et',
		countryCode: 'EE'
	},
	{
		name: 'Ewe',
		code: 'ee',
		countryCode: 'GH'
	},
	{
		name: 'Faroese',
		code: 'fo',
		countryCode: 'FO'
	},
	{
		name: 'Fijian',
		code: 'fj',
		countryCode: 'FJ'
	},
	{
		name: 'Finnish',
		code: 'fi',
		countryCode: 'FI'
	},
	{
		name: 'French',
		code: 'fr',
		countryCode: 'FR'
	},
	{
		name: 'Frisian',
		code: 'fy',
		countryCode: 'NL'
	},
	{
		name: 'Fula',
		code: 'ff',
		countryCode: 'ZA'
	},
	{
		name: 'Galician',
		code: 'gl',
		countryCode: 'ES'
	},
	{
		name: 'Georgian',
		code: 'ka',
		countryCode: 'GE'
	},
	{
		name: 'German',
		code: 'de',
		countryCode: 'DE'
	},
	{
		name: 'Greek',
		code: 'el',
		countryCode: 'GR'
	},
	{
		name: 'Greenlandic',
		code: 'kl',
		countryCode: 'DK'
	},
	{
		name: 'Guarani',
		code: 'gn',
		countryCode: 'PY'
	},
	{
		name: 'Gujarati',
		code: 'gu',
		countryCode: 'IN'
	},
	{
		name: 'Haitian Creole',
		code: 'ht',
		countryCode: 'HT'
	},
	{
		name: 'Hausa',
		code: 'ha',
		countryCode: 'NG'
	},
	{
		name: 'Hebrew',
		code: 'he',
		countryCode: 'IL'
	},
	{
		name: 'Herero',
		code: 'hz',
		countryCode: 'NA'
	},
	{
		name: 'Hindi',
		code: 'hi',
		countryCode: 'IN'
	},
	{
		name: 'Hiri Motu',
		code: 'ho',
		countryCode: 'PG'
	},
	{
		name: 'Hungarian',
		code: 'hu',
		countryCode: 'HU'
	},
	{
		name: 'Icelandic',
		code: 'is',
		countryCode: 'IS'
	},
	{
		name: 'Igbo',
		code: 'ig',
		countryCode: 'NG'
	},
	{
		name: 'Indonesian',
		code: 'id',
		countryCode: 'ID'
	},
	{
		name: 'Inuktitut',
		code: 'iu',
		countryCode: 'CA'
	},
	{
		name: 'Irish',
		code: 'ga',
		countryCode: 'IE'
	},
	{
		name: 'Italian',
		code: 'it',
		countryCode: 'IT'
	},
	{
		name: 'Japanese',
		code: 'ja',
		countryCode: 'JP'
	},
	{
		name: 'Javanese',
		code: 'jv',
		countryCode: 'ID'
	},
	{
		name: 'Kannada',
		code: 'kn',
		countryCode: 'IN'
	},
	{
		name: 'Kashmiri',
		code: 'ks',
		countryCode: 'IN'
	},
	{
		name: 'Kazakh',
		code: 'kk',
		countryCode: 'KZ'
	},
	{
		name: 'Khmer',
		code: 'km',
		countryCode: 'KH'
	},
	{
		name: 'Kinyarwanda',
		code: 'rw',
		countryCode: 'RW'
	},
	{
		name: 'Kongo',
		code: 'kg',
		countryCode: 'CD'
	},
	{
		name: 'Korean',
		code: 'ko',
		countryCode: 'KR'
	},
	{
		name: 'Kurdish',
		code: 'ku',
		countryCode: 'IR'
	},
	{
		name: 'Kwanyama',
		code: 'kj',
		countryCode: 'AO'
	},
	{
		name: 'Kyrgyz',
		code: 'ky',
		countryCode: 'KG'
	},
	{
		name: 'Lao',
		code: 'lo',
		countryCode: 'LA'
	},
	{
		name: 'Latin',
		code: 'la',
		countryCode: 'VA'
	},
	{
		name: 'Latvian',
		code: 'lv',
		countryCode: 'LV'
	},
	{
		name: 'Limburgish',
		code: 'li',
		countryCode: 'NL'
	},
	{
		name: 'Lingala',
		code: 'ln',
		countryCode: 'CD'
	},
	{
		name: 'Lithuanian',
		code: 'lt',
		countryCode: 'LT'
	},
	{
		name: 'Luganda',
		code: 'lg',
		countryCode: 'UG'
	},
	{
		name: 'Luxembourgish',
		code: 'lb',
		countryCode: 'LU'
	},
	{
		name: 'Macedonian',
		code: 'mk',
		countryCode: 'MK'
	},
	{
		name: 'Malagasy',
		code: 'mg',
		countryCode: 'MG'
	},
	{
		name: 'Malay',
		code: 'ms',
		countryCode: 'MY'
	},
	{
		name: 'Malayalam',
		code: 'ml',
		countryCode: 'IN'
	},
	{
		name: 'Maltese',
		code: 'mt',
		countryCode: 'MT'
	},
	{
		name: 'Manx',
		code: 'gv',
		countryCode: 'GB'
	},
	{
		name: 'Maori',
		code: 'mi',
		countryCode: 'NZ'
	},
	{
		name: 'Marathi',
		code: 'mr',
		countryCode: 'IN'
	},
	{
		name: 'Marshallese',
		code: 'mh',
		countryCode: 'MH'
	},
	{
		name: 'Mongolian',
		code: 'mn',
		countryCode: 'MN'
	},
	{
		name: 'Montenegrin',
		code: 'me',
		countryCode: 'ME'
	},
	{
		name: 'Nauru',
		code: 'na',
		countryCode: 'NR'
	},
	{
		name: 'Ndonga',
		code: 'ng',
		countryCode: 'NA'
	},
	{
		name: 'Nepali',
		code: 'ne',
		countryCode: 'NP'
	},
	{
		name: 'Northern Sami',
		code: 'se',
		countryCode: 'NO'
	},
	{
		name: 'Norwegian',
		code: 'no',
		countryCode: 'NO'
	},
	{
		name: 'Occitan',
		code: 'oc',
		countryCode: 'FR'
	},
	{
		name: 'Odia',
		code: 'or',
		countryCode: 'IN'
	},
	{
		name: 'Ojibwe',
		code: 'oj',
		countryCode: 'CA'
	},
	{
		name: 'Oromo',
		code: 'om',
		countryCode: 'ET'
	},
	{
		name: 'Pali',
		code: 'pi',
		countryCode: 'IN'
	},
	{
		name: 'Pashto',
		code: 'ps',
		countryCode: 'AF'
	},
	{
		name: 'Persian',
		code: 'fa',
		countryCode: 'IR'
	},
	{
		name: 'Polish',
		code: 'pl',
		countryCode: 'PL'
	},
	{
		name: 'Portuguese',
		code: 'pt',
		countryCode: 'PT'
	},
	{
		name: 'Punjabi',
		code: 'pa',
		countryCode: 'IN'
	},
	{
		name: 'Quechua',
		code: 'qu',
		countryCode: 'PE'
	},
	{
		name: 'Romanian',
		code: 'ro',
		countryCode: 'RO'
	},
	{
		name: 'Romansh',
		code: 'rm',
		countryCode: 'CH'
	},
	{
		name: 'Rundi',
		code: 'rn',
		countryCode: 'BI'
	},
	{
		name: 'Russian',
		code: 'ru',
		countryCode: 'RU'
	},
	{
		name: 'Sango',
		code: 'sg',
		countryCode: 'CF'
	},
	{
		name: 'Sanskrit',
		code: 'sa',
		countryCode: 'IN'
	},
	{
		name: 'Sardinian',
		code: 'sc',
		countryCode: 'IT'
	},
	{
		name: 'Scots',
		code: 'sco',
		countryCode: 'GB'
	},
	{
		name: 'Scottish Gaelic',
		code: 'gd',
		countryCode: 'GB'
	},
	{
		name: 'Serbian',
		code: 'sr',
		countryCode: 'RS'
	},
	{
		name: 'Serbo-Croatian',
		code: 'sh',
		countryCode: 'HR'
	},
	{
		name: 'Shona',
		code: 'sn',
		countryCode: 'ZW'
	},
	{
		name: 'Sichuan Yi',
		code: 'ii',
		countryCode: 'CN'
	},
	{
		name: 'Sindhi',
		code: 'sd',
		countryCode: 'PK'
	},
	{
		name: 'Sinhala',
		code: 'si',
		countryCode: 'LK'
	},
	{
		name: 'Slovak',
		code: 'sk',
		countryCode: 'SK'
	},
	{
		name: 'Slovenian',
		code: 'sl',
		countryCode: 'SI'
	},
	{
		name: 'Somali',
		code: 'so',
		countryCode: 'SO'
	},
	{
		name: 'Southern Ndebele',
		code: 'nr',
		countryCode: 'ZA'
	},
	{
		name: 'Southern Sotho',
		code: 'st',
		countryCode: 'ZA'
	},
	{
		name: 'Spanish',
		code: 'es',
		countryCode: 'ES'
	},
	{
		name: 'Sundanese',
		code: 'su',
		countryCode: 'ID'
	},
	{
		name: 'Swahili',
		code: 'sw',
		countryCode: 'KE'
	},
	{
		name: 'Swati',
		code: 'ss',
		countryCode: 'SZ'
	},
	{
		name: 'Swedish',
		code: 'sv',
		countryCode: 'SE'
	},
	{
		name: 'Tagalog',
		code: 'tl',
		countryCode: 'PH'
	},
	{
		name: 'Tahitian',
		code: 'ty',
		countryCode: 'PF'
	},
	{
		name: 'Tajik',
		code: 'tg',
		countryCode: 'TJ'
	},
	{
		name: 'Tamil',
		code: 'ta',
		countryCode: 'IN'
	},
	{
		name: 'Telugu',
		code: 'te',
		countryCode: 'IN'
	},
	{
		name: 'Thai',
		code: 'th',
		countryCode: 'TH'
	},
	{
		name: 'Tibetan',
		code: 'bo',
		countryCode: 'BT'
	},
	{
		name: 'Tigrinya',
		code: 'ti',
		countryCode: 'ER'
	},
	{
		name: 'Tsonga',
		code: 'ts',
		countryCode: 'ZA'
	},
	{
		name: 'Tswana',
		code: 'tn',
		countryCode: 'BW'
	},
	{
		name: 'Turkish',
		code: 'tr',
		countryCode: 'TR'
	},
	{
		name: 'Turkmen',
		code: 'tk',
		countryCode: 'TM'
	},
	{
		name: 'Ukrainian',
		code: 'uk',
		countryCode: 'UA'
	},
	{
		name: 'Urdu',
		code: 'ur',
		countryCode: 'IN'
	},
	{
		name: 'Uyghur',
		code: 'ug',
		countryCode: 'CN'
	},
	{
		name: 'Uzbek',
		code: 'uz',
		countryCode: 'UZ'
	},
	{
		name: 'Venda',
		code: 've',
		countryCode: 'ZA'
	},
	{
		name: 'Vietnamese',
		code: 'vi',
		countryCode: 'VN'
	},
	{
		name: 'Walloon',
		code: 'wa',
		countryCode: 'BE'
	},
	{
		name: 'Welsh',
		code: 'cy',
		countryCode: 'GB'
	},
	{
		name: 'Wolof',
		code: 'wo',
		countryCode: 'SN'
	},
	{
		name: 'Xhosa',
		code: 'xh',
		countryCode: 'ZA'
	},
	{
		name: 'Yiddish',
		code: 'yi',
		countryCode: 'DE'
	},
	{
		name: 'Yoruba',
		code: 'yo',
		countryCode: 'NG'
	},
	{
		name: 'Zulu',
		code: 'zu',
		countryCode: 'ZA'
	}
];
