<?php

namespace App\DataFixtures;

use DateTime;
use App\Entity\App;
use App\Entity\User;
use App\Entity\AppRole;
use App\Repository\AppRoleRepository;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use App\Repository\SectionPermissionsRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture {

    public function __construct(
        private UserPasswordHasherInterface $hasher,
        private SectionPermissionsRepository $sectionPermissionsRepository,
        private AppRoleRepository $appRoleRepository
    ) {
    }

    public function load(ObjectManager $manager): void {
        $users = $this->createUsers($manager);
        $apps = $this->createApps($manager, $users);
    }

    private function createUsers(ObjectManager $manager) {
        $users = [];

        $i = 1;
        while ($i <= 4) {
            $user = new User;
            $user->setEmail("fakeemail$i@fake.com");
            $user->setBirthDate(new DateTime("2000-0$i-0$i"));
            $user->setFirstName("Fake");
            $user->setLastName("User $i");
            $password = $this->hasher->hashPassword($user, "a123456789.");
            $user->setPassword($password);

            $manager->persist($user);
            array_push($users, $user);
            $i++;
        }

        $manager->flush();

        return $users;
    }


    /**
     * @param mixed $manager
     * @param User[] $users
     * 
     * @return [type]
     */
    private function createApps($manager, array $users) {
        $apps = [];
        $i = 1;
        while ($i <= 2) {
            $app = new App();
            $app->addUser($users[$i]);
            $app->setOwner($users[$i]);
            $app->setName("Test App $i");

            $ownerRole = new AppRole("Owner", $app, $this->sectionPermissionsRepository);
            $ownerRole->setIsDestroyable(false);

            $users[$i]->addAppRole($ownerRole);

            $app->addRole($ownerRole);
            $app->setDefaultRole($ownerRole);

            $users[$i]->getUserOptions()->setSelectedApp($app);

            $manager->persist($ownerRole);
            $manager->persist($users[$i]);
            $manager->persist($app);

            array_push($apps, $app);
            $i++;
        }

        $manager->flush();

        return $apps;
    }
}
