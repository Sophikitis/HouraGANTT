<?php

namespace App\Http\Controllers;
use App\Resource;
use App\Task;
use Illuminate\Http\Request;
use Validator;

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignUpRequest;
use App\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'signup','ChangePasswordController']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['message' => 'Email or password does\'t exist'], 200);
        }

        return $this->respondWithToken($token);
    }

    public function signup(SignUpRequest $request)
    {
        User::create($request->all());
        return response()->json(['message' => 'Succesfull registration'], 200);
        //return $this->login($request);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        // return response()->json(auth()->user());
        return new UserResource(User::find(auth()->user()->id));
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        $user = User::find(auth()->user()->id);
        $user->token = $token;
        $user->save();
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }

    public function updateProfil(Request $request){
        $user = User::find(auth()->user()->id);
        $user->name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->password =  Hash::make($request->password);
        $user->avatar = $request->avatar;
        $user->rgpd_accepted = $request->rgpd_accepted;
        $user->save();
        Storage::put('avatars/1', $request->avatar);
    }

    public function DownloadUserInfo(Request $request)
    {
        $user = DB::table('users')->select('first_name', 'email as user_email','last_name','avatar')
            ->where('id', '=', auth()->user()->id)
            ->get();
        $project_user = DB::table('project_user')->where('user_id', '=',auth()->user()->id)->get();
        $projects = array();
        if($project_user){
            foreach ($project_user as $project){
                $each_project = DB::table('projects')->where('id', '=',$project->project_id)->first();
                if($project->project_owner === 0){
                    $each_project->project_status = "owner";
                }else{
                    $each_project->project_status = "invited";
                }
                $projects[] = $each_project;
            }
        }
        $filename = 'public/data_'.auth()->user()->id.'.json';
        $file = 'data_'.auth()->user()->id.'.json';
        $json =  response()->json(['user' => $user,'projects'=> $projects]);
        $directory = "http://192.168.33.10/storage/".$file;
        Storage::put($filename, $json);
        return response()->json(['status' => 'sucess','data'=> $directory]);
       }

    public function ForgetMe()
    {
        $valid = true;
        $project_user = DB::table('project_user')->where('user_id', '=',auth()->user()->id)->get();
        if($project_user){
            foreach ($project_user as $project){
                $projectId = $project->project_id;
                if($project->project_owner === 0){
                    $valid = Task::where('project_id', $projectId)->delete();
                    $valid = Resource::where('project_id', $projectId)->delete();
                    $valid = DB::table('project_user')->where('project_id', '=', $projectId)->delete();
                    $valid = DB::table('projects')->where('id', '=', $projectId)->delete();
                }else{
                    $valid = DB::table('project_user')
                        ->where('project_id', '=', $projectId)
                        ->where('user_id', '=', auth()->user()->id)
                        ->delete();
                }
            }
        }
        $valid = DB::table('users')->where('id', '=', auth()->user()->id)->delete();
        if($valid){
            return response()->json(['message' => "user delete with success",'status'=> 'sucess']);

        }else{
            return response()->json(['message' => "error occured",'status'=> 'failed']);

        }

    }

    public function admin_credential_rules(array $data)
    {
        $messages = [
            'current-password.required' => 'Please enter current password',
            'password.required' => 'Please enter password',
        ];

        $validator = Validator::make($data, [
            'current_password' => 'required',
            'password' => 'required|same:password',
            'password_confirmation' => 'required|same:password',
        ], $messages);

        return $validator;
    }

    public function UpdateUserInfo(Request $request){
        $user = User::whereEmail($request->email)->first();
        if($request->password != ""){
            $render =   $user->update(['password'=>$request->password,'first_name'=>$request->first_name,'last_name'=>$request->last_name]);

        }else{
            $render =   $user->update(['first_name'=>$request->first_name,'last_name'=>$request->last_name]);
        }
        if($render){
            return response()->json([
                'status' => 'success',
                'message' => 'Update user successful',
                'data' => $render,
                'status_code' => 200
            ]);
        }else{
            return response()->json([
                'status' => 'fail',
                'message' => 'Update user failed',
                'status_code' => 401
            ]);
        }
    }
}