<?php
/**
 * Created by PhpStorm.
 * User: lincoln
 * Date: 24/07/2018
 * Time: 21:57
 */

class Helper
{
    public static function verify($token,$model,$ret){
        $get=$model::where('token','=',$token)->first();
        return $get;
    }
}