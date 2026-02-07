<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Logging\OpenTestReporting\Status;

class CreateClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
          $table->string('parent_name');
            $table->string('client_name');
            $table->text('client_address');
            $table->string('responsible_person');
            $table->string('contact_person');
            $table->string('financial_year');
            $table->enum('audit_type', ['statutory', 'external'])->default('statutory');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
                $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clients');
    }
}
