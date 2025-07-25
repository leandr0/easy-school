package br.com.easyschool.domain.types;

public enum TechnicalConfigCodeType {
    
    WHATSAPP_LINK(1);

    private final int CODE;

    TechnicalConfigCodeType(int code) {
        this.CODE = code;
    }

    public int getValue(){
        return CODE;
    }
}
