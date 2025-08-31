export { MessageType }

enum MessageType {
    TWO_FACTOR = '2T',
    HANDSHAKE = 'HI',
    DELETE_EVIDENCE = 'DE',
    CHOOSE_CHARACTER = 'CC',
    CHECK = 'CH',
    SEND_CHARACTER_MESSAGE = 'MS',
    EDIT_EVIDENCE = 'EE',
    CHANGE_POSITION = 'SP',
    ASK_CHARACTER = 'askchaa',
    ASK_CHARACTER_2 = 'askchar2',
    RETRIEVE_CHARACTERS = 'RC',
    REQUEST_ID = 'ID',
    REQUEST_EVIDENCE = 'AE',
    RD = 'RD',
    REQUEST_MUSIC = 'AM',
    RM = 'RM',
    AN = 'AN',
    MOD_COMMAND = 'MA',
    OUT_OF_CHARACTER_MESSAGE = 'CT',
    MUSIC_CHANGE = 'MC',
    CREATE_EVIDENCE = 'PE',
    MOD_CALL = 'ZZ',
    SEND_TESTIMONY = 'RT',
    HEALTH_POINTS = 'HP'
}

