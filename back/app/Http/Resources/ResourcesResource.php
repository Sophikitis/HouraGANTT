<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ResourcesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'ratio' => $this->ratio,
            'job' => $this->job,
            'first_name' => $this->first_name,
            'created_at' => (string) $this->created_at,
            'updated_at' => (string) $this->updated_at,
            'project_id' => $this->project_id,
        ];
    }
}
