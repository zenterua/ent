import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CookieService {
    setCookie(cname, cvalue, hours) {
        var d = new Date();
        d.setTime(d.getTime() + hours * 3600000);
        var expires = (hours)?"expires=" + d.toUTCString():"";
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }
    
    deleteCookie(cname) { 
        var d = new Date(); 
        d.setTime(d.getTime() - (1000*60*60*24));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname+"="+"; "+expires + ";path=/";

    }
}
