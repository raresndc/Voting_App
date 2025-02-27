package com.auth.model;

import java.util.List;

public class AccesTokenDetails {

    public List<String> aud;
    public String user_name;
    public List<String> scope;
    public boolean active;
    public int exp;
    public List<String> authorities;
    public String jti;
    public String client_id;
    public int responseCode;
    public String errorMessage;
}
